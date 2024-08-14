import { useAuth } from "@/hooks";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputLeftElement,
  InputGroup,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { FaEthereum } from "react-icons/fa6";

interface PaymasterCreateFormProps {
  formik: FormikProps<{
    name: string;
    factory: `0x${string}`;
    owner: `0x${string}`;
    deposit: number;
  }>;
  supportedFactories: {
    address: `0x${string}`;
    name: string;
    description: string;
  }[];
  isLoading: boolean;
}

const PaymasterCreateForm = ({
  formik,
  supportedFactories,
  isLoading,
}: PaymasterCreateFormProps) => {
  const { address } = useAuth();

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4}>
        <Heading size="md">Create Paymaster</Heading>
        <FormControl>
          <FormLabel htmlFor="factory">Factory</FormLabel>
          <Select
            placeholder="Select factory"
            variant="filled"
            id="factory"
            name="factory"
            onChange={formik.handleChange}
            value={formik.values.factory}
          >
            {supportedFactories.map((factory) => (
              <>
                <option key={factory.address} value={factory.address}>
                  {factory.name}
                </option>
              </>
            ))}
          </Select>
          {formik.values.factory && (
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {
                supportedFactories.find(
                  (factory) => factory.address === formik.values.factory
                )?.description
              }
            </Text>
          )}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="name">Paymaster Name</FormLabel>
          <Input
            id="name"
            name="name"
            type="name"
            variant="filled"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="owner">Owner</FormLabel>
          <Input
            id="owner"
            name="owner"
            type="owner"
            variant="filled"
            onChange={formik.handleChange}
            value={formik.values.owner}
          />
          <Button
            size="sm"
            colorScheme="blue"
            variant="link"
            mt={2}
            mx={2}
            onClick={() => formik.setFieldValue("owner", address)}
          >
            Use My Wallet
          </Button>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="deposit">Deposit</FormLabel>
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
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
        >
          Create
        </Button>
      </VStack>
    </form>
  );
};

export default PaymasterCreateForm;
