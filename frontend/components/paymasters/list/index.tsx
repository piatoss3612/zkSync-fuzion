import { Box, SimpleGrid, Center } from "@chakra-ui/react";
import React from "react";
import PaymasterCard from "./PaymasterCard";
import { PaymasterCreated } from "@/types";

interface PaymasterListProps {
  paymasters: PaymasterCreated[];
}

const PaymasterList = ({ paymasters }: PaymasterListProps) => {
  if (paymasters.length === 0) {
    return (
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        No paymasters found
      </Box>
    );
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} gap={4} w="full">
      {paymasters.map((paymaster) => (
        <PaymasterCard key={paymaster.id} paymaster={paymaster} />
      ))}
    </SimpleGrid>
  );
};

export default PaymasterList;
