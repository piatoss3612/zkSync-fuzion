import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import PaymasterCard from "./PaymasterCard";

const PaymasterList = () => {
  return (
    <SimpleGrid columns={[1, 2, 3]} gap={4} w="full">
      <PaymasterCard />
      <PaymasterCard />
      <PaymasterCard />
      <PaymasterCard />
      <PaymasterCard />
      <PaymasterCard />
    </SimpleGrid>
  );
};

export default PaymasterList;
