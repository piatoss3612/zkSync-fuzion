"use client";

import { Container, Stack, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Headline from "@/components/home/Headline";
import BigLogo from "@/components/home/BigLogo";
import Description from "@/components/home/Description";
import GetStartedButton from "@/components/home/GetStartedButton";

const Page = () => {
  const router = useRouter();

  return (
    <Container maxW="2xl" px={{ base: 4, sm: "1.6rem" }}>
      <Stack
        textAlign="center"
        align="center"
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Headline />
        <Description />
        <GetStartedButton onClick={() => router.push("/paymasters")} />
        <BigLogo />
      </Stack>
    </Container>
  );
};

export default Page;
