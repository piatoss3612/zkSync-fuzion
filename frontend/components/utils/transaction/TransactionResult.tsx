import {
  CheckCircleIcon,
  ExternalLinkIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { Link, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface TransactionResultProps {
  status: "success" | "error";
  hash: string;
  description?: string;
}

const TransactionResult = ({
  status,
  hash,
  description,
}: TransactionResultProps) => {
  return (
    <Stack spacing={4} justify="center" align="center">
      {status === "success" ? (
        <CheckCircleIcon
          name="check-circle"
          color="green.500"
          boxSize={"2.4rem"}
        />
      ) : (
        <WarningIcon name="warning" color="red.500" boxSize={"2.4rem"} />
      )}

      <Text fontWeight="bold" textAlign="center">
        {description}
      </Text>
      <Link
        href={`https://sepolia.explorer.zksync.io/tx/${hash || ""}`}
        isExternal
      >
        See on Explorer <ExternalLinkIcon mx="2px" />
      </Link>
    </Stack>
  );
};

export default TransactionResult;
