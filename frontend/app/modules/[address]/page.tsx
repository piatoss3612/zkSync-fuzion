"use client";

import CenteredMessage from "@/components/utils/message/CenteredMessage";
import { useAuth } from "@/hooks";
import { Box } from "@chakra-ui/react";

const Page = ({
  params,
}: {
  params: {
    address: `0x${string}`;
  };
}) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <CenteredMessage message="Please sign in to view this page" />;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="1"
      px="1.6rem"
    >
      {params.address} Module
    </Box>
  );
};

export default Page;
