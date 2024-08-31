import TransactionResult from "@/components/utils/transaction/TransactionResult";
import { useAuth, useModal } from "@/hooks";
import { abbreviateAddress, FUZION_PAYMASTER_ABI } from "@/libs/contract";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaLink, FaEthereum, FaCalendarAlt } from "react-icons/fa";
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
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const localDate = new Date(paymaster.blockTimestamp * 1000).toLocaleString();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBgColor = useColorModeValue("blue.500", "blue.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

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

  const depositFormik = useFormik<{
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
      setIsDepositOpen(false);
    },
  });

  const withdrawFormik = useFormik<{
    withdraw: number;
  }>({
    initialValues: {
      withdraw: 0,
    },
    onSubmit: async (values) => {
      const ether = parseEther(values.withdraw.toString());

      const data = encodeFunctionData({
        abi: FUZION_PAYMASTER_ABI,
        functionName: "withdraw",
        args: [address, ether],
      });

      await sendTransactionAsync({
        to: paymaster.paymaster,
        data,
      });

      values.withdraw = 0;
      setIsWithdrawOpen(false);
    },
  });

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
        borderRadius="xl"
        overflow="hidden"
        boxShadow="lg"
        bg={bgColor}
        borderColor={borderColor}
        _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
        transition="all 0.3s"
      >
        <CardHeader bg={headerBgColor} color="white" py={4}>
          <Heading size="lg" textAlign="center" fontWeight="bold">
            {paymaster.name}
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Tooltip
              label={paymaster.paymaster}
              aria-label="Full paymaster address"
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                bg={useColorModeValue("gray.100", "gray.700")}
                py={2}
                px={3}
                borderRadius="lg"
                _hover={{
                  bg: useColorModeValue("gray.200", "gray.600"),
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(paymaster.paymaster);
                  toast({
                    title: "Address copied to clipboard",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                <Box as={FaLink} size="16px" color={mutedTextColor} mr={3} />
                <Text fontSize="md" fontWeight="medium" color={textColor}>
                  {abbreviatedAddress}
                </Text>
              </Flex>
            </Tooltip>

            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Text fontSize="sm" color={mutedTextColor} mb={1}>
                Balance
              </Text>
              <Flex alignItems="center">
                <Box as={FaEthereum} size="24px" color="blue.500" mr={2} />
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {parseFloat(balance).toFixed(4)} ETH
                </Text>
              </Flex>
            </Flex>

            <Flex alignItems="center" justifyContent="center">
              <Box
                as={FaCalendarAlt}
                size="14px"
                color={mutedTextColor}
                mr={2}
              />
              <Text fontSize="sm" color={mutedTextColor}>
                Deployed on {localDate}
              </Text>
            </Flex>

            <ButtonGroup justifyContent="center" spacing={4}>
              <Button
                colorScheme="blue"
                variant={isDepositOpen ? "solid" : "outline"}
                onClick={() => {
                  setIsDepositOpen(!isDepositOpen);
                  setIsWithdrawOpen(false);
                }}
              >
                {isDepositOpen ? "Close" : "Deposit"}
              </Button>
              <Button
                colorScheme="blue"
                variant={isWithdrawOpen ? "solid" : "outline"}
                onClick={() => {
                  setIsWithdrawOpen(!isWithdrawOpen);
                  setIsDepositOpen(false);
                }}
              >
                {isWithdrawOpen ? "Close" : "Withdraw"}
              </Button>
              <Button
                colorScheme="blue"
                variant="ghost"
                onClick={() =>
                  router.push(`/paymasters/${paymaster.paymaster}`)
                }
              >
                Details
              </Button>
            </ButtonGroup>
          </VStack>
        </CardBody>
        {isDepositOpen && (
          <CardFooter justifyContent="center">
            <form onSubmit={depositFormik.handleSubmit}>
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
                      onChange={depositFormik.handleChange}
                      value={depositFormik.values.deposit}
                    />
                  </InputGroup>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isWritePending || isLoading}
                >
                  Confirm Deposit
                </Button>
              </VStack>
            </form>
          </CardFooter>
        )}
        {isWithdrawOpen && (
          <CardFooter justifyContent="center">
            <form onSubmit={withdrawFormik.handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel htmlFor="withdraw">Withdraw Amount</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaEthereum color="gray.300" />
                    </InputLeftElement>
                    <Input
                      id="withdraw"
                      name="withdraw"
                      type="number"
                      variant="filled"
                      onChange={withdrawFormik.handleChange}
                      value={withdrawFormik.values.withdraw}
                    />
                  </InputGroup>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isWritePending || isLoading}
                >
                  Confirm Withdraw
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
