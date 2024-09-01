"use client";

import CenteredMessage from "@/components/utils/message/CenteredMessage";
import CenteredSpinner from "@/components/utils/message/CenteredSpinner";
import { useAuth, useModal } from "@/hooks";
import {
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
  IMODULE_ABI,
} from "@/libs/contract";
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Badge,
  Divider,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Tooltip,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Abi, encodeFunctionData, parseAbi } from "viem";
import {
  useReadContract,
  useReadContracts,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { FaStar, FaUsers } from "react-icons/fa";
import ModuleTypeBadge from "@/components/modules/common/ModuleTypeBadge";
import InstallDataForm from "@/components/modules/form/InstallDataForm";
import RatingForm from "@/components/modules/form/RatingForm";
import TransactionResult from "@/components/utils/transaction/TransactionResult";

const Page = ({
  params,
}: {
  params: {
    address: `0x${string}`;
  };
}) => {
  const toast = useToast();
  const router = useRouter();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");
  const installDataColor = useColorModeValue("gray.100", "gray.700");

  const { isSignedIn, address: userAddress } = useAuth();
  const { openModal } = useModal();

  const {
    data: isModuleRegistered,
    isFetched: isModuleRegisteredFetched,
    isLoading: isModuleRegisteredLoading,
  } = useReadContract({
    abi: FUZION_ROUTER_ABI,
    address: FUZION_ROUTER_ADDRESS,
    functionName: "isModuleRegistered",
    args: [params.address],
  });

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        abi: IMODULE_ABI,
        address: params.address,
        functionName: "metadata",
      },
      {
        abi: FUZION_ROUTER_ABI,
        address: FUZION_ROUTER_ADDRESS,
        functionName: "getModuleRatingData",
        args: [params.address],
      },
      {
        abi: FUZION_ROUTER_ABI,
        address: FUZION_ROUTER_ADDRESS,
        functionName: "hasRatedModule",
        args: [userAddress, params.address],
      },
    ],
    query: {
      enabled: isModuleRegistered && isSignedIn,
      retry: 3,
      refetchInterval: 10000, // 10 seconds
    },
  });

  const moduleMetadata = data?.[0].result;
  const moduleRatingData = data?.[1].result;
  const hasRatedModule = data?.[2].result;

  const installDataAbi = useMemo(() => {
    if (!moduleMetadata) return [];

    let signature = moduleMetadata.installDataSignature;
    // check if signature has 'function' prefix
    if (!signature.startsWith("function")) {
      signature = `function ${signature}`;
    }

    try {
      const abi: Abi = parseAbi([signature]);
      return abi;
    } catch (error) {
      console.error("Error parsing install data signature", error);
      return [];
    }
  }, [moduleMetadata]);

  const rating = useMemo(() => {
    if (!moduleRatingData) return 0;
    const accumulativeRating = moduleRatingData.accumulativeRating;
    const accumulativeRatingCount = moduleRatingData.accumulativeRatingCount;
    if (accumulativeRatingCount === BigInt(0)) return 0;
    const ratingValue =
      Number(accumulativeRating) / Number(accumulativeRatingCount);
    return Math.round(ratingValue * 10) / 10;
  }, [moduleRatingData]);
  const ratedCount = useMemo(() => {
    if (!moduleRatingData) return 0;
    return Number(moduleRatingData.accumulativeRatingCount);
  }, [moduleRatingData]);

  const {
    sendTransactionAsync,
    data: hash,
    isPending: isWritePending,
    isError,
    error,
  } = useSendTransaction();
  const {
    data: receipt,
    isLoading: isReceiptLoading,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash });

  const handleRatingSubmit = async (rating: string) => {
    // TODO: Implement rating submission logic

    const ratingValue = Number(rating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      toast({
        title: "Invalid rating",
        description: "Please enter a rating between 1 and 5",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const data = encodeFunctionData({
      abi: FUZION_ROUTER_ABI,
      functionName: "rateModule",
      args: [params.address, ratingValue],
    });

    // Submit rating
    await sendTransactionAsync({
      to: FUZION_ROUTER_ADDRESS,
      data,
    });
  };

  useEffect(() => {
    if (isModuleRegisteredFetched && !isModuleRegistered) {
      router.push("/modules");
      toast({
        title: "Module not found",
        description: `The module with address ${params.address} is not registered on the Fuzion Router contract`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isModuleRegisteredFetched, isModuleRegistered]);

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

  if (!isSignedIn) {
    return <CenteredMessage message="Please sign in to view this page" />;
  }

  if (isModuleRegisteredLoading || isLoading) {
    return <CenteredSpinner message="Loading module data..." />;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="1"
      px="1.6rem"
      py="2rem"
    >
      <Box
        maxWidth="800px"
        width="100%"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="lg"
        bg={bgColor}
        borderColor={borderColor}
        p={6}
      >
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="xl" fontFamily={""}>
              {moduleMetadata?.name}
            </Heading>
            <ModuleTypeBadge
              moduleType={moduleMetadata?.moduleType || 0}
              size="md"
            />
          </Flex>

          <Divider />

          <StatGroup>
            <Stat>
              <StatLabel>Rating</StatLabel>
              <StatNumber>
                <Flex alignItems="center">
                  <FaStar color="gold" size="20px" />
                  <Text ml={2}>{rating.toFixed(1)}</Text>
                </Flex>
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Total Ratings</StatLabel>
              <StatNumber>
                <Flex alignItems="center">
                  <FaUsers color={mutedTextColor} size="20px" />
                  <Text ml={2}>{ratedCount}</Text>
                </Flex>
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Your Rating</StatLabel>
              <StatNumber>
                <Badge
                  colorScheme={hasRatedModule ? "green" : "red"}
                  fontSize="md"
                  p={1}
                >
                  {hasRatedModule ? "Rated" : "Not Rated"}
                </Badge>
              </StatNumber>
            </Stat>
          </StatGroup>

          {!hasRatedModule && (
            <RatingForm
              onSubmit={handleRatingSubmit}
              isLoading={isWritePending || isReceiptLoading}
            />
          )}

          <VStack align="start" spacing={4}>
            <Flex>
              <Text fontWeight="bold" width="100px">
                Version:
              </Text>
              <Text>{moduleMetadata?.version}</Text>
            </Flex>
            <Flex>
              <Text fontWeight="bold" width="100px">
                Author:
              </Text>
              <Text>{moduleMetadata?.author}</Text>
            </Flex>
            <Flex>
              <Text fontWeight="bold" width="100px">
                Address:
              </Text>
              <Text>{params.address}</Text>
            </Flex>
          </VStack>

          <Box>
            <Text fontWeight="bold" mb={2}>
              Install Data Signature:
            </Text>
            <Text
              fontSize="sm"
              fontFamily="monospace"
              bg={installDataColor}
              p={2}
              borderRadius="md"
              noOfLines={2}
            >
              {moduleMetadata?.installDataSignature}
            </Text>
          </Box>
          {installDataAbi.length > 0 && (
            <InstallDataForm abi={[installDataAbi[0]]} />
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Page;
