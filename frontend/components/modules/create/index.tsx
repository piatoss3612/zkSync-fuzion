import { ModuleMetadata } from "@/types";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Box,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  useDisclosure,
  Collapse,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import ModuleTypeBadge from "../common/ModuleTypeBadge";
import { useEffect } from "react";

interface ModuleRegisterFormProps {
  formik: FormikProps<{
    address: `0x${string}`;
  }>;
  metadata: ModuleMetadata | undefined;
  isLoading: boolean;
  isDisabled: boolean;
  disabledMessage: string;
}

const ModuleRegisterForm = ({
  formik,
  metadata,
  isLoading,
  isDisabled,
  disabledMessage,
}: ModuleRegisterFormProps) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (metadata) {
      onOpen();
    } else {
      onClose();
    }
  }, [metadata, onOpen, onClose]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={6} my={4} align="stretch">
        <Heading size="lg" textAlign="center" fontFamily={""}>
          Register Module
        </Heading>
        <FormControl>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input
            id="address"
            name="address"
            type="text"
            variant="filled"
            onChange={formik.handleChange}
            value={formik.values.address}
          />
        </FormControl>
        <Collapse in={isOpen} animateOpacity>
          {metadata && (
            <Box
              borderWidth={1}
              borderRadius="md"
              p={8}
              bg={bgColor}
              borderColor={borderColor}
            >
              <Heading size="md" mb={4} fontFamily={""}>
                Module Metadata
              </Heading>
              <Grid
                templateColumns="minmax(150px, auto) 1fr"
                gap={4}
                justifyContent="space-between"
              >
                <GridItem fontWeight="bold">Module Type:</GridItem>
                <GridItem justifySelf="end">
                  <ModuleTypeBadge moduleType={metadata.moduleType} />
                </GridItem>

                <GridItem fontWeight="bold">Name:</GridItem>
                <GridItem justifySelf="end">{metadata.name}</GridItem>

                <GridItem fontWeight="bold">Version:</GridItem>
                <GridItem justifySelf="end">{metadata.version}</GridItem>

                <GridItem fontWeight="bold">Author:</GridItem>
                <GridItem justifySelf="end">{metadata.author}</GridItem>

                <GridItem fontWeight="bold">Install Data Signature:</GridItem>
                <GridItem justifySelf="end">
                  <Text
                    isTruncated
                    maxWidth="200px"
                    title={metadata.installDataSignature}
                  >
                    {metadata.installDataSignature}
                  </Text>
                </GridItem>
              </Grid>
            </Box>
          )}
        </Collapse>
        {isDisabled && (
          <Alert status="error" variant="left-accent" borderRadius="md">
            <AlertIcon />
            {disabledMessage}
          </Alert>
        )}
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
          isDisabled={isDisabled}
        >
          Register
        </Button>
      </VStack>
    </form>
  );
};

export default ModuleRegisterForm;
