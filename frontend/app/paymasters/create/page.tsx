"use client";

import CenteredMessage from "@/components/utils/message/CenteredMessage";
import PaymasterCreateForm from "@/components/paymasters/create";
import TransactionResult from "@/components/utils/transaction/TransactionResult";
import { useAuth, useModal } from "@/hooks";
import { FUZION_ROUTER_ABI, FUZION_ROUTER_ADDRESS } from "@/libs/contract";
import { Box, Container, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { encodeFunctionData, keccak256, parseEther, toHex } from "viem";
import {
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

const Page = () => {
  const toast = useToast();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { openModal } = useModal();
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

  const closeModalCallback = useCallback(() => {
    if (isSuccess) {
      router.push("/paymasters");
    }
  }, [isSuccess]);

  const formik = useFormik<{
    name: string;
    owner: `0x${string}`;
    feeTo: `0x${string}`;
    seed: string;
    deposit: number;
  }>({
    initialValues: {
      name: "",
      owner: "0x",
      feeTo: "0x",
      seed: "",
      deposit: 0,
    },
    onSubmit: async (values) => {
      // TODO: Add validation
      const ether = parseEther(values.deposit.toString());
      const salt = keccak256(toHex(values.seed));

      const data = encodeFunctionData({
        abi: FUZION_ROUTER_ABI,
        functionName: "createPaymaster",
        args: [salt, values.owner, values.feeTo, values.name, "0x"],
      });

      await sendTransactionAsync({
        to: FUZION_ROUTER_ADDRESS,
        data,
        value: ether,
      });
    },
  });

  const { data: paymasterAddress } = useReadContract({
    abi: FUZION_ROUTER_ABI,
    address: FUZION_ROUTER_ADDRESS,
    functionName: "calculatePaymasterAddress",
    args: [
      keccak256(toHex(formik.values.seed)),
      formik.values.owner,
      formik.values.feeTo,
    ],
    query: {
      enabled: !!formik.values.owner && !!formik.values.feeTo,
    },
  });

  useEffect(() => {
    if (receipt) {
      openModal(
        "Transaction Result",
        <TransactionResult
          status={isSuccess ? "success" : "error"}
          hash={hash || ""}
          description={isSuccess ? "Paymaster created" : "Transaction reverted"}
        />,
        closeModalCallback
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
  }, [isError, error, toast]);

  if (!isSignedIn) {
    return <CenteredMessage message="Please sign in to create a paymaster" />;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="1"
      px="1.6rem"
    >
      <Container>
        <Box bg="white" p={6} rounded="md" my={10}>
          <PaymasterCreateForm
            formik={formik}
            isLoading={isWritePending || isLoading}
            expectedAddress={paymasterAddress}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
