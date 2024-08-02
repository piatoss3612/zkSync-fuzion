import {
  Container,
  Stack,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Search2Icon } from "@chakra-ui/icons";
import { BsPlusLg } from "react-icons/bs";
import PaymasterList from "./list";

const Paymasters = () => {
  const router = useRouter();

  return (
    <Container maxW={"6xl"} px="1.6rem">
      <VStack spacing={8} py={12}>
        <HStack
          justifyContent={{ base: "center", md: "space-between" }}
          w="full"
          spacing={4}
        >
          <InputGroup size="md" w={"auto"}>
            <InputLeftElement
              pointerEvents="none"
              children={<Search2Icon color="gray.500" />}
            />
            <Input type="text" placeholder="Search" />
          </InputGroup>
          <Button
            leftIcon={<Icon as={BsPlusLg} />}
            colorScheme="blue"
            _hover={{ bg: "blue.600" }}
            onClick={() => router.push("/paymasters/create")}
          >
            New Paymaster
          </Button>
        </HStack>
        <PaymasterList />
      </VStack>
    </Container>
  );
};

export default Paymasters;
