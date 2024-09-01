import { ModuleRegistered } from "@/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Text,
  VStack,
  ButtonGroup,
  GridItem,
  useToast,
  Flex,
  Tooltip,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import ModuleTypeBadge from "../common/ModuleTypeBadge";
import { useReadContract } from "wagmi";
import {
  abbreviateAddress,
  formatRatingCount,
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
} from "@/libs/contract";
import {
  FaStar,
  FaLink,
  FaCalendarAlt,
  FaInfoCircle,
  FaUsers,
} from "react-icons/fa";

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
  const ratedCount = useMemo(() => {
    if (!data) return 0;
    return Number(data.accumulativeRatingCount);
  }, [data]);

  const abbreviatedAddress = abbreviateAddress(module.module);

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBgColor = useColorModeValue("blue.500", "blue.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");
  const addressBgColor = useColorModeValue("gray.100", "gray.700");
  const addressHoverBgColor = useColorModeValue("gray.200", "gray.600");

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
          <Heading
            size="lg"
            textAlign="center"
            fontWeight="bold"
            fontFamily={""}
          >
            {module.name}
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Tooltip label={module.module} aria-label="Full module address">
              <Flex
                alignItems="center"
                justifyContent="center"
                bg={addressBgColor}
                py={2}
                px={3}
                borderRadius="lg"
                _hover={{ bg: addressHoverBgColor, cursor: "pointer" }}
                onClick={() => {
                  navigator.clipboard.writeText(module.module);
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

            <Flex justifyContent="space-between" alignItems="center">
              <ModuleTypeBadge
                moduleType={module.moduleType}
                size="sm"
                px={3}
                py={1}
              />
              <Tooltip label={`${ratedCount} total ratings`}>
                <Flex alignItems="center">
                  <Box as={FaUsers} size="14px" color={mutedTextColor} mr={2} />
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    {formatRatingCount(ratedCount)}
                  </Text>
                </Flex>
              </Tooltip>
              <Flex
                alignItems="center"
                bg={addressBgColor}
                py={1}
                px={3}
                borderRadius="full"
                boxShadow="sm"
              >
                <FaStar color="gold" size="14" />
                <Text ml={2} fontSize="sm" fontWeight="bold" color={textColor}>
                  {rating.toFixed(1)}
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

            <ButtonGroup justifyContent="center">
              <Button
                onClick={() => router.push(`/modules/${module.module}`)}
                colorScheme="blue"
                variant="solid"
                _hover={{ transform: "translateY(-1px)", boxShadow: "sm" }}
                transition="all 0.2s"
                leftIcon={<FaInfoCircle />}
              >
                Details
              </Button>
            </ButtonGroup>
          </VStack>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default ModuleCard;
