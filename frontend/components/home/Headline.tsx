import { Heading, Text } from "@chakra-ui/react";
import React from "react";

const Headline = () => {
  return (
    <Heading
      fontFamily={""}
      fontSize={{ base: "4xl", md: "5xl" }}
      lineHeight={"120%"}
    >
      Easy way to manage
      <br />
      <Text as={"span"} color={"blue.500"}>
        ZKsync Paymasters
      </Text>
    </Heading>
  );
};

export default Headline;
