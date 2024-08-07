import { Button } from "@chakra-ui/react";
import React from "react";

interface GetStartedButtonProps {
  onClick: () => void;
}

const GetStartedButton = ({ onClick }: GetStartedButtonProps) => {
  return (
    <Button
      rounded={"full"}
      px={6}
      colorScheme={"blackAlpha"}
      bg={"blackAlpha.900"}
      _hover={{ bg: "blackAlpha.800" }}
      onClick={onClick}
    >
      Get started
    </Button>
  );
};

export default GetStartedButton;
