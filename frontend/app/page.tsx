"use client";

import { Box, Center, Stack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Box display="flex" flexDirection="column" minH="100vh" p={4} bg="gray.100">
      <Center flexGrow={1}>
        <Stack spacing={4}>
          <ConnectButton />
          {session ? (
            <Box>
              <p>Signed in as {session.user!.name}</p>
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
