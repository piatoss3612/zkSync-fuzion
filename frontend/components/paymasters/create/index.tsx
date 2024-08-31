import { useAuth } from "@/hooks";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputLeftElement,
  InputGroup,
  VStack,
  FormHelperText,
  Box,
  useColorModeValue,
  Flex,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import {
  FaEthereum,
  FaUser,
  FaMoneyBillWave,
  FaSeedling,
  FaCheckCircle,
} from "react-icons/fa";

interface PaymasterCreateFormProps {
  formik: FormikProps<{
    name: string;
    owner: `0x${string}`;
    feeTo: `0x${string}`;
    seed: string;
    deposit: number;
  }>;
  isLoading: boolean;
  expectedAddress: `0x${string}` | undefined;
}

const PaymasterCreateForm = ({
  formik,
  isLoading,
  expectedAddress,
}: PaymasterCreateFormProps) => {
  const toast = useToast();
  const { address } = useAuth();
  const helperTextColor = useColorModeValue("gray.600", "gray.400");
  const expectedAddressBg = useColorModeValue("blue.50", "blue.900");
  const expectedAddressBorder = useColorModeValue("blue.200", "blue.700");

  return (
    <Box borderRadius="lg" p={4}>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center" mb={4} fontFamily={""}>
            Create Paymaster
          </Heading>
          <FormControl>
            <FormLabel htmlFor="name">Paymaster Name</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <FormHelperText color={helperTextColor}>
              Unique name for your paymaster
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="owner">Owner</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaUser color="gray.300" />
              </InputLeftElement>
              <Input
                id="owner"
                name="owner"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.owner}
              />
            </InputGroup>
            <FormHelperText color={helperTextColor}>
              Address with control over this paymaster
              <Button
                size="xs"
                colorScheme="blue"
                variant="link"
                ml={2}
                onClick={() => formik.setFieldValue("owner", address)}
              >
                Use My Address
              </Button>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="feeTo">Fee To</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaMoneyBillWave color="gray.300" />
              </InputLeftElement>
              <Input
                id="feeTo"
                name="feeTo"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.feeTo}
              />
            </InputGroup>
            <FormHelperText color={helperTextColor}>
              Address to receive fees
              <Button
                size="xs"
                colorScheme="blue"
                variant="link"
                ml={2}
                onClick={() => formik.setFieldValue("feeTo", address)}
              >
                Use My Address
              </Button>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="seed">Seed</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaSeedling color="gray.300" />
              </InputLeftElement>
              <Input
                id="seed"
                name="seed"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.seed}
              />
            </InputGroup>
            <FormHelperText color={helperTextColor}>
              String to generate unique paymaster address
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="deposit">Initial Deposit</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaEthereum color="gray.300" />
              </InputLeftElement>
              <Input
                id="deposit"
                name="deposit"
                type="number"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.deposit}
              />
            </InputGroup>
            <FormHelperText color={helperTextColor}>
              Amount of ETH to deposit initially
            </FormHelperText>
          </FormControl>
          {expectedAddress && (
            <Box
              borderWidth={1}
              borderRadius="md"
              p={4}
              bg={expectedAddressBg}
              borderColor={expectedAddressBorder}
            >
              <Flex alignItems="center" mb={2}>
                <FaCheckCircle color="green" />
                <Text fontWeight="bold" ml={2}>
                  Expected Paymaster Address
                </Text>
              </Flex>
              <Tooltip label="Click to copy" placement="top">
                <Text
                  fontSize="md"
                  fontFamily=""
                  cursor="pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(expectedAddress);
                    toast({
                      title: "Address copied",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                >
                  {expectedAddress}
                </Text>
              </Tooltip>
            </Box>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading}
            mt={4}
          >
            Create
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PaymasterCreateForm;
