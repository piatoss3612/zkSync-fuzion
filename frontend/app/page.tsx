"use client";

import { useAuth } from "@/hooks";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const { isWalletConnected } = useAuth();

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
    <Stack spacing={4} align="center" p={4} mt={4}>
      {isWalletConnected && (
        <>
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
  );
}
