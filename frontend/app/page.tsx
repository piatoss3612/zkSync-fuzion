import { Box, Center, Container } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <Box display="flex" flexDirection="column" minH="100vh" p={4} bg="gray.100">
      <Center flexGrow={1}>
        <ConnectButton />
      </Center>
    </Box>
  );
}
