import TransactionResult from "@/components/utils/transaction/TransactionResult";
import { useAuth, useModal } from "@/hooks";
import { abbreviateAddress, IPAYMASTER_ABI } from "@/libs/contract";
import { PaymasterCreated } from "@/types";
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
  GridItem,
  useToast,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputLeftElement,
  InputGroup,
  Tooltip,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa6";
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
  const router = useRouter();
  const toast = useToast();
  const { address } = useAuth();
  const { openModal } = useModal();
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  const localDate = new Date(paymaster.blockTimestamp * 1000).toLocaleString();

  const { data } = useBalance({
    address: paymaster.paymaster,
    query: {
      refetchInterval: 3000,
    },
  });

  const balance = data ? formatUnits(data.value, data.decimals) : "0";

  const abbreviatedAddress = abbreviateAddress(paymaster.paymaster);

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
    if (receipt) {
      openModal(
        "Transaction Result",
        <TransactionResult
          status={isSuccess ? "success" : "error"}
          hash={hash || ""}
          description={
            isSuccess ? "Transaction successful" : "Transaction reverted"
          }
        />,
        () => {}
      );
    }
  }, [receipt, hash, isSuccess]);

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
            <Tooltip
              label={paymaster.paymaster}
              aria-label="Full paymaster address"
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                bg="gray.100"
                py={1}
                px={2}
                borderRadius="md"
                _hover={{ bg: "gray.200", cursor: "pointer" }}
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
                <Box as={FaLink} size="12px" color="gray.500" mr={2} />
                <Text fontSize="md" fontWeight="medium" color="gray.700">
                  {abbreviatedAddress}
                </Text>
              </Flex>
            </Tooltip>
            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              Balance: {balance} ETH
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              deployed on {localDate}
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
              <Button
                colorScheme="blue"
                onClick={() =>
                  router.push(`/paymasters/${paymaster.paymaster}`)
                }
              >
                Details
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
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaEthereum color="gray.300" />
                    </InputLeftElement>
                    <Input
                      id="deposit"
                      name="deposit"
                      type="number"
                      variant="filled"
                      onChange={formik.handleChange}
                      value={formik.values.deposit}
                    />
                  </InputGroup>
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
  );
};

export default PaymasterCard;
