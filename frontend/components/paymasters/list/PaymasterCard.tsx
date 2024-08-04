import { PaymasterCreated } from "@/types";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface PaymasterCardProps {
  paymaster: PaymasterCreated;
}

const PaymasterCard = ({ paymaster }: PaymasterCardProps) => {
  const localDate = new Date(paymaster.blockTimestamp * 1000).toLocaleString();
  return (
    <Card align="center">
      <CardHeader>
        <Heading size="md">{paymaster.name}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{paymaster.paymaster}</Text>
        <Text>{localDate}</Text>
      </CardBody>
      <CardFooter>
        <Button colorScheme="blue">Details</Button>
      </CardFooter>
    </Card>
  );
};

export default PaymasterCard;
