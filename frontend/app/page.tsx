"use client";

import { useAuth } from "@/hooks";
import { Box, Button, Center, Stack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { signedIn, isLoading, handleSignIn, handleSignOut } = useAuth();

  return (
    <Box display="flex" flexDirection="column" minH="100vh" p={4} bg="gray.100">
      <Center flexGrow={1}>
        <Stack spacing={4} align="center">
          <ConnectButton />
          <Box>
            <Button
              colorScheme="blue"
              onClick={signedIn ? handleSignOut : handleSignIn}
              isLoading={isLoading}
            >
              {signedIn ? "Sign out" : "Sign in"}
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
        </Stack>
      </Center>
    </Box>
  );
}
