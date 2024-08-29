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
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { FaEthereum } from "react-icons/fa6";

interface PaymasterCreateFormProps {
  formik: FormikProps<{
    name: string;
    owner: `0x${string}`;
    feeTo: `0x${string}`;
    seed: string;
    deposit: number;
  }>;
  isLoading: boolean;
}

const PaymasterCreateForm = ({
  formik,
  isLoading,
}: PaymasterCreateFormProps) => {
  const { address } = useAuth();

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4} my={2}>
        <Heading size="md">Create Paymaster</Heading>
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
            Use My Address
          </Button>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="feeTo">Fee To</FormLabel>
          <Input
            id="feeTo"
            name="feeTo"
            type="feeTo"
            variant="filled"
            onChange={formik.handleChange}
            value={formik.values.feeTo}
          />
          <Button
            size="sm"
            colorScheme="blue"
            variant="link"
            mt={2}
            mx={2}
            onClick={() => formik.setFieldValue("feeTo", address)}
          >
            Use My Address
          </Button>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="seed">Seed</FormLabel>
          <Input
            id="seed"
            name="seed"
            type="seed"
            variant="filled"
            onChange={formik.handleChange}
            value={formik.values.seed}
          />
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
          mt={2}
        >
          Create
        </Button>
      </VStack>
    </form>
  );
};

export default PaymasterCreateForm;
