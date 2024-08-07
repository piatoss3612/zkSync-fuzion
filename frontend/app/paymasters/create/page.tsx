"use client";

import PaymasterCreateForm from "@/components/paymasters/create";
import SignInRequired from "@/components/utils/auth/SignInRequired";
import TransactionResult from "@/components/utils/transaction/TransactionResult";
import { useAuth, useModal } from "@/hooks";
import {
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
  SupportedFactories,
} from "@/libs/contract";
import { Box, Container, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { encodeFunctionData, parseEther } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

const Page = () => {
  const toast = useToast();
  const router = useRouter();
  const { address, isSignedIn } = useAuth();
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
    factory: `0x${string}`;
    owner: `0x${string}`;
    deposit: number;
  }>({
    initialValues: {
      name: "",
      factory: "0x",
      owner: "0x",
      deposit: 0,
    },
    onSubmit: async (values) => {
      // TODO: Add validation
      const ether = parseEther(values.deposit.toString());
      const data = encodeFunctionData({
        abi: FUZION_ROUTER_ABI,
        functionName: "createPaymaster",
        args: [values.factory, values.owner, values.name, "0x0"],
      });

      await sendTransactionAsync({
        to: FUZION_ROUTER_ADDRESS,
        data,
        value: ether,
      });
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
  }, [isError, error]);

  if (!isSignedIn) {
    return <SignInRequired message="Please sign in to create a paymaster" />;
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
        <Box bg="white" p={6} rounded="md">
          <PaymasterCreateForm
            formik={formik}
            supportedFactories={SupportedFactories}
            isLoading={isWritePending || isLoading}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
