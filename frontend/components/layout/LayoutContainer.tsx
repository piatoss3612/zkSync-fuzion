import { Box } from "@chakra-ui/react";
import React from "react";

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display="flex" flexDirection="column" minH="100vh" p={4} bg="gray.100">
      {children}
    </Box>
  );
};

export default LayoutContainer;
