import { Box, Container, Heading, Spinner, VStack } from "@chakra-ui/react";
import React from "react";

interface CenteredSpinnerProps {
  message?: string;
}

const CenteredSpinner = ({ message }: CenteredSpinnerProps) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1">
      <VStack spacing={4}>
        <Spinner size="xl" />
        {message && (
          <Heading size="sm" fontFamily={""}>
            {message}
          </Heading>
        )}
      </VStack>
    </Box>
  );
};

export default CenteredSpinner;
