import SignInRequired from "@/components/auth/SignInRequired";
import ResultModal from "@/components/modal";
import { useAuth } from "@/hooks";
import {
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
  GASLESS_PAYMASTER_ADDRESS,
} from "@/libs/contract";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Select,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { parseEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const PaymasterCreateForm = () => {
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isSignedIn } = useAuth();

  const supportedFactories: `0x${string}`[] = [GASLESS_PAYMASTER_ADDRESS];

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    isError,
    error,
  } = useWriteContract();
  const {
    data: receipt,
    isLoading,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash });

  const handleCloseModal = useCallback(() => {
    onClose();
    if (isSuccess) {
      router.push("/paymasters");
      router.refresh();
    }
  }, [isSuccess]);

  const formik = useFormik<{
    name: string;
    factory: `0x${string}`;
    owner: `0x${string}`;
    deposit: number;
  }>({
    initialValues: {
      name: "",
      factory: "0x",
      owner: address,
      deposit: 0,
    },
    onSubmit: (values) => {
      // TODO: Add validation
      const ether = parseEther(values.deposit.toString());

      writeContract({
        address: FUZION_ROUTER_ADDRESS,
        abi: FUZION_ROUTER_ABI,
        functionName: "createPaymaster",
        args: [values.factory, values.owner, values.name, "0x0"],
        value: ether,
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      onOpen();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: error?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isError, error]);

  if (!isSignedIn) {
    return <SignInRequired message="Please sign in to create a paymaster" />;
  }

  return (
    <>
      <ResultModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        status={isSuccess ? "success" : "error"}
        header={"Transaction Result"}
        subheader={isSuccess ? "Paymaster created" : "Transaction reverted"}
        content={
          isSuccess ? (
            <Link
              href={`https://sepolia.explorer.zksync.io/tx/${hash || ""}`}
              isExternal
            >
              See on Explorer <ExternalLinkIcon mx="2px" />
            </Link>
          ) : null
        }
      />
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
                  <FormLabel htmlFor="owner">Owner</FormLabel>
                  <Input
                    id="owner"
                    name="owner"
                    type="owner"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.owner}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="owner">Deposit</FormLabel>
                  <Input
                    id="deposit"
                    name="deposit"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.deposit}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isWritePending || isLoading}
                >
                  Create
                </Button>
              </VStack>
            </form>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PaymasterCreateForm;
