import { Box, SimpleGrid, Center, Text, Spinner } from "@chakra-ui/react";
import React from "react";
import PaymasterCard from "../card";
import { PaymasterCreated } from "@/types";

interface PaymasterListProps {
  paymasters: PaymasterCreated[];
  isLoading: boolean;
}

const PaymasterList = ({ paymasters, isLoading }: PaymasterListProps) => {
  if (paymasters.length === 0) {
    return (
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        {isLoading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Text
            textAlign="center"
            fontSize="lg"
            color="gray.500"
            fontWeight="semibold"
          >
            No paymasters found
          </Text>
        )}
      </Box>
    );
  }

  return (
    <SimpleGrid
      columns={[1, 1, 2, 2, 3]}
      gap={6}
      w="full"
      justifyItems="center"
    >
      {paymasters.map((paymaster) => (
        <PaymasterCard key={paymaster.id} paymaster={paymaster} />
      ))}
    </SimpleGrid>
  );
};

export default PaymasterList;
