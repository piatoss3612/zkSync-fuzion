import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import PaymasterCard from "./PaymasterCard";
import { PaymasterCreated } from "@/types";

interface PaymasterListProps {
  paymasters: PaymasterCreated[];
}

const PaymasterList = ({ paymasters }: PaymasterListProps) => {
  return (
    <SimpleGrid columns={[1, 2, 3]} gap={4} w="full">
      {paymasters.map((paymaster) => (
        <PaymasterCard key={paymaster.id} paymaster={paymaster} />
      ))}
    </SimpleGrid>
  );
};

export default PaymasterList;
