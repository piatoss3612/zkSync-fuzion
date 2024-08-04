import SignInRequired from "@/components/auth/SignInRequired";
import { useAuth } from "@/hooks";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";

const PaymasterCreateForm = () => {
  const { address, isSignedIn } = useAuth();
  const formik = useFormik({
    initialValues: {
      name: "",
      owner: address,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
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
