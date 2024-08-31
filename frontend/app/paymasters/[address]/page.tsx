"use client";

import CenteredMessage from "@/components/utils/message/CenteredMessage";
import { useAuth } from "@/hooks";
import { PaymasterCreated } from "@/types";
import { Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

const Page = ({
  params,
}: {
  params: {
    address: `0x${string}`;
  };
}) => {
  const { isSignedIn } = useAuth();

  const getPaymaster = useCallback(async () => {
    const resp = await axios.get<PaymasterCreated>(
      `/api/paymasters/${params.address}`
    );

    if (resp.status !== 200) {
      console.error(resp);

      throw new Error(
        (resp.data as any).message || "Failed to fetch paymaster"
      );
    }

    return resp.data;
  }, [params.address]);

  const {
    data: paymaster,
    isError,
    error,
  } = useQuery({
    queryKey: ["paymaster", params.address],
    queryFn: getPaymaster,
    enabled: isSignedIn,
    retry: 3,
  });

  if (!isSignedIn) {
    return <CenteredMessage message="Please sign in to view this page" />;
  }

  if (isError) {
    return <CenteredMessage message={error.message} />;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="1"
      px="1.6rem"
    >
      {paymaster ? (
        <pre>{JSON.stringify(paymaster, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </Box>
  );
};

export default Page;
