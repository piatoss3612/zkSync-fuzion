import SignInRequired from "@/components/auth/SignInRequired";
import { useAuth } from "@/hooks";
import {
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
  GASLESS_PAYMASTER_ADDRESS,
} from "@/libs/contract";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const PaymasterCreateForm = () => {
  const { address, isSignedIn } = useAuth();

  const supportedFactories: `0x${string}`[] = [GASLESS_PAYMASTER_ADDRESS];

  const {
    writeContract,
    data,
    isPending: isWritePending,
    isError,
    error,
  } = useWriteContract();
  const {
    data: receipt,
    isLoading,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash: data });

  const formik = useFormik<{
    name: string;
    factory: `0x${string}`;
    owner: `0x${string}`;
  }>({
    initialValues: {
      name: "",
      factory: "0x",
      owner: address,
    },
    onSubmit: (values) => {
      writeContract({
        address: FUZION_ROUTER_ADDRESS,
        abi: FUZION_ROUTER_ABI,
        functionName: "createPaymaster",
        args: [values.factory, values.owner, values.name, "0x0"],
      });
    },
  });

  if (!isSignedIn) {
    return <SignInRequired message="Please sign in to create a paymaster" />;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="1"
      px="1.6rem"
    >
      <Container>
        <Box bg="white" p={6} rounded="md">
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
                    <option key={factory} value={factory}>
                      {factory}
                    </option>
                  ))}
                </Select>
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
                <FormLabel htmlFor="owner">Owner Address</FormLabel>
                <Input
                  id="owner"
                  name="owner"
                  type="owner"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.owner}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Create
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymasterCreateForm;
