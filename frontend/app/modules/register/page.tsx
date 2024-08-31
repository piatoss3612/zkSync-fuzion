"use client";

import CenteredMessage from "@/components/utils/message/CenteredMessage";
import TransactionResult from "@/components/utils/transaction/TransactionResult";
import { useAuth, useModal } from "@/hooks";
import {
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
  IMODULE_ABI,
  IMODULE_INTERFACE_ID,
} from "@/libs/contract";
import { Box, Container, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { encodeFunctionData } from "viem";
import {
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import ModuleRegisterForm from "@/components/modules/create";
import { useQuery } from "@tanstack/react-query";

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
      router.push("/modules");
    }
  }, [isSuccess]);

  const formik = useFormik<{
    address: `0x${string}`;
  }>({
    initialValues: {
      address: "0x",
    },
    onSubmit: async (values) => {
      // TODO: Add validation
      const data = encodeFunctionData({
        abi: FUZION_ROUTER_ABI,
        functionName: "registerModule",
        args: [values.address],
      });
      await sendTransactionAsync({
        to: FUZION_ROUTER_ADDRESS,
        data,
      });
    },
  });

  const { data: isSupportingIModuleInterface } = useReadContract({
    abi: IMODULE_ABI,
    address: formik.values.address,
    functionName: "supportsInterface",
    args: [IMODULE_INTERFACE_ID],
    query: {
      enabled: formik.values.address !== "0x",
    },
  });

  const { data: isModuleRegistered } = useReadContract({
    abi: FUZION_ROUTER_ABI,
    address: FUZION_ROUTER_ADDRESS,
    functionName: "isModuleRegistered",
    args: [formik.values.address],
    query: {
      enabled: formik.values.address !== "0x" && isSupportingIModuleInterface,
    },
  });

  const { data: moduleMetadata } = useReadContract({
    abi: IMODULE_ABI,
    address: formik.values.address,
    functionName: "metadata",
    query: {
      enabled:
        formik.values.address !== "0x" &&
        isSupportingIModuleInterface &&
        !isModuleRegistered,
    },
  });

  useEffect(() => {
    if (receipt) {
      openModal(
        "Transaction Result",
        <TransactionResult
          status={isSuccess ? "success" : "error"}
          hash={hash || ""}
          description={isSuccess ? "Module registered" : "Transaction reverted"}
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
    return <CenteredMessage message="Please sign in to register a module" />;
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
          <ModuleRegisterForm
            formik={formik}
            metadata={moduleMetadata}
            isLoading={isWritePending || isLoading}
            isDisabled={!isSupportingIModuleInterface || !!isModuleRegistered}
            disabledMessage={
              isModuleRegistered
                ? "Module already registered"
                : !isSupportingIModuleInterface
                ? "Module does not support IModule interface"
                : ""
            }
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
