import { Box, Container, Heading } from "@chakra-ui/react";
import React from "react";

interface SignInRequiredProps {
  message: string;
}

const SignInRequired = ({ message }: SignInRequiredProps) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1">
      <Container px="1.6rem" my={4}>
        <Box bg="white" p={6} rounded="md" textAlign="center">
          <Heading size="md">{message}</Heading>
        </Box>
      </Container>
    </Box>
  );
};

export default SignInRequired;
