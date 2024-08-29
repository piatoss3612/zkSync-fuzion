"use client";

import { Box } from "@chakra-ui/react";

const Page = ({
  params,
}: {
  params: {
    address: `0x${string}`;
  };
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="1"
      px="1.6rem"
    >
      <h1>Paymaster: {params.address}</h1>
    </Box>
  );
};

export default Page;
