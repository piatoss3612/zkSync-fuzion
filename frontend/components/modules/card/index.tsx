import { ModuleRegistered } from "@/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Stack,
  Divider,
  ButtonGroup,
  GridItem,
  useToast,
  Flex,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import ModuleTypeBadge from "../common/ModuleTypeBadge";
import { useReadContract } from "wagmi";
import {
  abbreviateAddress,
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
} from "@/libs/contract";
import { FaStar, FaLink } from "react-icons/fa";

interface ModuleCardProps {
  module: ModuleRegistered;
}

const ModuleCard = ({ module }: ModuleCardProps) => {
  const router = useRouter();
  const toast = useToast();
  const localDate = new Date(module.blockTimestamp * 1000).toLocaleString();

  const { data } = useReadContract({
    abi: FUZION_ROUTER_ABI,
    address: FUZION_ROUTER_ADDRESS,
    functionName: "getModuleRatingData",
    args: [module.module],
  });

  const rating = useMemo(() => {
    if (!data) return 0;

    const accumulativeRating = data.accumulativeRating;
    const accumulativeRatingCount = data.accumulativeRatingCount;

    if (accumulativeRatingCount === BigInt(0)) return 0;

    const ratingValue =
      Number(accumulativeRating) / Number(accumulativeRatingCount);
    return Math.round(ratingValue * 10) / 10;
  }, [data]);

  const abbreviatedAddress = abbreviateAddress(module.module);

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
        _hover={{ boxShadow: "md" }}
      >
        <CardHeader bg="blue.500" color="white" py={3}>
          <Heading size="md" textAlign="center">
            {module.name}
          </Heading>
        </CardHeader>
        <Divider />
        <CardBody>
          <Stack spacing={4}>
            <Tooltip label={module.module} aria-label="Full module address">
              <Flex
                alignItems="center"
                justifyContent="center"
                bg="gray.100"
                py={1}
                px={2}
                borderRadius="md"
                _hover={{ bg: "gray.200", cursor: "pointer" }}
                onClick={() => {
                  navigator.clipboard.writeText(module.module);
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
            <Flex justifyContent="center" alignItems="center" px={2} gap={8}>
              <ModuleTypeBadge moduleType={module.moduleType} />
              <Flex alignItems="center">
                <FaStar color="gold" size="14" />
                <Text ml={1} fontSize="sm" fontWeight="bold">
                  {rating.toFixed(1)}
                </Text>
              </Flex>
            </Flex>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              deployed on {localDate}
            </Text>
            <ButtonGroup justifyContent="center">
              <Button
                colorScheme="blue"
                onClick={() => router.push(`/modules/${module.module}`)}
                isDisabled={true} // TODO: Enable when module details page is ready
              >
                Details
              </Button>
            </ButtonGroup>
          </Stack>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default ModuleCard;
