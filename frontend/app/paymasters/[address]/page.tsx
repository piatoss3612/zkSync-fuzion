"use client";

import CenteredMessage from "@/components/utils/message/CenteredMessage";
import CenteredSpinner from "@/components/utils/message/CenteredSpinner";
import { useAuth } from "@/hooks";
import { PaymasterCreated } from "@/types";
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Badge,
  Divider,
  useColorModeValue,
  Button,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";

const Page = ({
  params,
}: {
  params: {
    address: `0x${string}`;
  };
}) => {
  const router = useRouter();
  const toast = useToast();
  const { isSignedIn } = useAuth();
  const { hasCopied: hasAddressCopied, onCopy: onAddressCopy } = useClipboard(
    params.address
  );
  const { hasCopied: hasOwnerCopied, onCopy: onOwnerCopy } = useClipboard(
    params.address
  );

  const getPaymaster = useCallback(async () => {
    const resp = await axios.get<PaymasterCreated>(
      `/api/paymasters/${params.address}`
    );

    if (resp.status !== 200) {
      console.error(resp);
      throw new Error(
        (resp.data as any).message || "Failed to fetch paymaster"
      );
    }

    return resp.data;
  }, [params.address]);

  const {
    data: paymaster,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["paymaster", params.address],
    queryFn: getPaymaster,
    enabled: isSignedIn,
    retry: 3,
  });

  const paymasterData = paymaster || {
    paymaster: params.address,
    owner: "0x0",
    blockTimestamp: 0,
    name: "Unknown",
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    if (isFetched && !paymaster) {
      router.push("/paymasters");
      toast({
        title: "Paymaster not found",
        description: "The paymaster you are looking for does not exist",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [paymaster, isFetched]);

  if (!isSignedIn) {
    return <CenteredMessage message="Please sign in to view this page" />;
  }

  if (isLoading) {
    return <CenteredSpinner message="Loading paymaster details..." />;
  }

  return (
    <Box
      display="flex"
      alignItems="flex-start"
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
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="xl">{paymasterData.name}</Heading>
            <Badge colorScheme="blue" fontSize="md" p={2}>
              Paymaster
            </Badge>
          </Flex>

          <Divider />

          <VStack align="start" spacing={4}>
            <Flex
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontWeight="bold">Address:</Text>
              <Flex alignItems="center">
                <Text mr={2}>{paymasterData.paymaster}</Text>
                <Tooltip
                  label={hasAddressCopied ? "Copied!" : "Copy to clipboard"}
                >
                  <Button
                    size="sm"
                    onClick={onAddressCopy}
                    leftIcon={<FaCopy />}
                  />
                </Tooltip>
              </Flex>
            </Flex>

            <Flex
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontWeight="bold">Owner:</Text>
              <Flex alignItems="center">
                <Text mr={2}>{paymasterData.owner}</Text>
                <Tooltip
                  label={hasOwnerCopied ? "Copied!" : "Copy to clipboard"}
                >
                  <Button
                    size="sm"
                    onClick={onOwnerCopy}
                    leftIcon={<FaCopy />}
                  />
                </Tooltip>
              </Flex>
            </Flex>

            <Flex
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontWeight="bold">Created At:</Text>
              <Text>
                {new Date(paymasterData.blockTimestamp * 1000).toLocaleString()}
              </Text>
            </Flex>
          </VStack>

          <Divider />

          <Flex justifyContent="center">
            <Button
              leftIcon={<FaExternalLinkAlt />}
              colorScheme="blue"
              onClick={() =>
                window.open(
                  `https://sepolia.explorer.zksync.io/address/${paymasterData.paymaster}`,
                  "_blank"
                )
              }
            >
              View on Explorer
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default Page;
