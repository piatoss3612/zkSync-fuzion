import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import HeroImage from "@/public/logo.png";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  return (
    <Container maxW={"3xl"} px="1.6rem">
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontFamily={""}
          fontSize={{ base: "4xl", md: "5xl" }}
          lineHeight={"120%"}
        >
          Easy way to manage
          <br />
          <Text as={"span"} color={"blue.500"}>
            zkSync Paymasters
          </Text>
        </Heading>
        <Text color={"gray.600"} maxW={"2xl"}>
          Fusion is a simple and easy to use tool to deploy and manage your
          zkSync Paymasters. Modularity and simplicity are the core of Fusion.
          Get started by creating your first Paymaster. It&apos;s free!
        </Text>
        <Button
          rounded={"full"}
          px={6}
          colorScheme={"blackAlpha"}
          bg={"blackAlpha.900"}
          _hover={{ bg: "blackAlpha.800" }}
          onClick={() => router.push("/paymasters")}
        >
          Get started
        </Button>
        <Flex justify={"center"} align={"center"}>
          <Image
            src={HeroImage.src}
            alt={"Hero Image"}
            fit={"contain"}
            align={"center"}
            w={"60%"}
            h={"60%"}
          />
        </Flex>
      </Stack>
    </Container>
  );
};

export default Home;
