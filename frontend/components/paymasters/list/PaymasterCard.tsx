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
} from "@chakra-ui/react";
import React from "react";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";

interface PaymasterCardProps {
  paymaster: PaymasterCreated;
}

const PaymasterCard = ({ paymaster }: PaymasterCardProps) => {
  const localDate = new Date(paymaster.blockTimestamp * 1000).toLocaleString();

  const { data } = useBalance({
    address: paymaster.paymaster,
  });

  const balance = data ? formatUnits(data.value, data.decimals) : "0";

  return (
    <Card
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      _hover={{ boxShadow: "xl" }}
      justifySelf={["center", "center", "auto"]}
    >
      <CardHeader bg="blue.500" color="white" py={3}>
        <Heading size="md" textAlign="center">
          {paymaster.name}
        </Heading>
      </CardHeader>
      <Divider />
      <CardBody>
        <Stack spacing={3}>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            {paymaster.paymaster}
          </Text>
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            Balance: {balance} ETH
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            {localDate}
          </Text>
        </Stack>
      </CardBody>
      <CardFooter justifyContent="center">
        <Button colorScheme="blue">Details</Button>
      </CardFooter>
    </Card>
  );
};

export default PaymasterCard;
