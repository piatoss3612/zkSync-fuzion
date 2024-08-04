import ResultModal from "@/components/modal";
import { useAuth } from "@/hooks";
import { IPAYMASTER_ABI } from "@/libs/contract";
import { PaymasterCreated } from "@/types";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  Stack,
  Divider,
  ButtonGroup,
  useDisclosure,
  GridItem,
  useToast,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Link,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { encodeFunctionData, formatUnits, parseEther } from "viem";
import {
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

interface PaymasterCardProps {
  paymaster: PaymasterCreated;
}

const PaymasterCard = ({ paymaster }: PaymasterCardProps) => {
  const toast = useToast();
  const { address } = useAuth();
  const { isOpen: isResultModalOpen, onOpen, onClose } = useDisclosure();
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  const localDate = new Date(paymaster.blockTimestamp * 1000).toLocaleString();

  const { data } = useBalance({
    address: paymaster.paymaster,
    query: {
      refetchInterval: 3000,
    },
  });

  const balance = data ? formatUnits(data.value, data.decimals) : "0";

  const {
    sendTransactionAsync,
    data: hash,
    isPending: isWritePending,
    isError,
    error,
  } = useSendTransaction();
  const {
    data: receipt,
    isLoading,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash });

  const formik = useFormik<{
    deposit: number;
  }>({
    initialValues: {
      deposit: 0,
    },
    onSubmit: async (values) => {
      const ether = parseEther(values.deposit.toString());

      await sendTransactionAsync({
        to: paymaster.paymaster,
        value: ether,
      });

      values.deposit = 0;
      setIsFooterOpen(false);
    },
  });

  const handleWithdraw = async () => {
    const data = encodeFunctionData({
      abi: IPAYMASTER_ABI,
      functionName: "withdraw",
      args: [address],
    });

    await sendTransactionAsync({
      to: paymaster.paymaster,
      data,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onOpen();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: error?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isError, error]);

  return (
    <>
      <ResultModal
        isOpen={isResultModalOpen}
        onClose={onClose}
        status={isSuccess ? "success" : "error"}
        header={"Transaction Result"}
        subheader={isSuccess ? "Transaction successful" : "Transaction failed"}
        content={
          isSuccess ? (
            <Link
              href={`https://sepolia.explorer.zksync.io/tx/${hash || ""}`}
              isExternal
            >
              See on Explorer <ExternalLinkIcon mx="2px" />
            </Link>
          ) : null
        }
      />
      <GridItem
        w="full"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Card
          maxW="sm"
          w="full"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="sm"
          _hover={{ boxShadow: "xl" }}
        >
          <CardHeader bg="blue.500" color="white" py={3}>
            <Heading size="md" textAlign="center">
              {paymaster.name}
            </Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <Stack spacing={4}>
              <Text
                fontSize="sm"
                color="gray.600"
                textAlign="center"
                _hover={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => {
                  navigator.clipboard.writeText(paymaster.paymaster);
                  toast({
                    title: "Address copied to clipboard",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                }}
              >
                {paymaster.paymaster}
              </Text>
              <Text fontSize="lg" fontWeight="bold" textAlign="center">
                Balance: {balance} ETH
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                {localDate}
              </Text>
              <ButtonGroup justifyContent="center">
                <Button
                  colorScheme="blue"
                  onClick={() => setIsFooterOpen(!isFooterOpen)}
                >
                  {isFooterOpen ? "Close" : "Deposit"}
                </Button>
                <Button colorScheme="blue" onClick={handleWithdraw}>
                  Withdraw
                </Button>
              </ButtonGroup>
            </Stack>
          </CardBody>
          {isFooterOpen && (
            <CardFooter justifyContent="center">
              <form onSubmit={formik.handleSubmit}>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel htmlFor="deposit">Deposit Amount</FormLabel>
                    <Input
                      id="deposit"
                      name="deposit"
                      type="number"
                      variant="filled"
                      onChange={formik.handleChange}
                      value={formik.values.deposit}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={isWritePending || isLoading}
                  >
                    Deposit
                  </Button>
                </VStack>
              </form>
            </CardFooter>
          )}
        </Card>
      </GridItem>
    </>
  );
};

export default PaymasterCard;
