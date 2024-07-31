"use client";

import { useAuth } from "@/hooks";
import { Box, Button, Center, Stack, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const {
    isWalletConnected,
    isSignedIn,
    isLoading,
    handleSignIn,
    handleSignOut,
  } = useAuth();

  const [message, setMessage] = useState<string | null>(null);

  const handleProtected = async () => {
    try {
      const response = await fetch("/api/protected");
      const data = await response.json();
      const message = data.message as string;
      setMessage(message);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" minH="100vh" p={4} bg="gray.100">
      <Center flexGrow={1}>
        <Stack spacing={4} align="center">
          <ConnectButton />
          {isWalletConnected && (
            <>
              <Box>
                <Button
                  colorScheme="blue"
                  onClick={isSignedIn ? handleSignOut : handleSignIn}
                  isLoading={isLoading}
                >
                  {isSignedIn ? "Sign out" : "Sign in"}
                </Button>
              </Box>
              {session ? (
                <Box>
                  <p>Signed in as {session.user!.name}</p>
                  <p>Expires: {session.expires}</p>
                </Box>
              ) : (
                <Box>
                  <p>Not signed in</p>
                </Box>
              )}
              <Stack spacing={4} align="center">
                <Button colorScheme="blue" onClick={handleProtected}>
                  Protected
                </Button>
                {message && <Text>{message}</Text>}
              </Stack>
            </>
          )}
        </Stack>
      </Center>
    </Box>
  );
}
