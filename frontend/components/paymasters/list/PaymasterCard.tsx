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

const PaymasterCard = () => {
  return (
    <Card align="center">
      <CardHeader>
        <Heading size="md"> Customer Paymaster</Heading>
      </CardHeader>
      <CardBody>
        <Text>This is a paymaster card</Text>
      </CardBody>
      <CardFooter>
        <Button colorScheme="blue">Details</Button>
      </CardFooter>
    </Card>
  );
};

export default PaymasterCard;
