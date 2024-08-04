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
import { PaymasterCreated } from "@/types";

const Paymasters = () => {
  const router = useRouter();

  const paymasters: PaymasterCreated[] = [
    {
      id: "1",
      name: "Paymaster 1",
      owner: "0x1234567890",
      paymaster: "0x1234567890",
      paymasterFactory: "0x1234567890",
      blockTimestamp: 1234567890,
    },
    {
      id: "2",
      name: "Paymaster 2",
      owner: "0x1234567890",
      paymaster: "0x1234567890",
      paymasterFactory: "0x1234567890",
      blockTimestamp: 1234567890,
    },
    {
      id: "3",
      name: "Paymaster 3",
      owner: "0x1234567890",
      paymaster: "0x1234567890",
      paymasterFactory: "0x1234567890",
      blockTimestamp: 1234567890,
    },
  ];

  return (
    <Container maxW={"6xl"} px="1.6rem">
      <VStack spacing={8} py={12}>
        <HStack
          justifyContent={{ base: "center", md: "space-between" }}
          w="full"
          spacing={4}
        >
          <InputGroup size="md" w={"auto"}>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="gray.500" />
            </InputLeftElement>
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
        <PaymasterList paymasters={paymasters} />
      </VStack>
    </Container>
  );
};

export default Paymasters;
