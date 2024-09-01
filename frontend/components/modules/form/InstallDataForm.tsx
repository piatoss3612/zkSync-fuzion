import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Box,
  Flex,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import { Abi, AbiParameter, encodeFunctionData } from "viem";
import { FaCopy } from "react-icons/fa";

interface InstallDataFormProps {
  abi: Abi;
}

const InstallDataForm: React.FC<InstallDataFormProps> = ({ abi }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [encodedData, setEncodedData] = useState<string | null>(null);
  const toast = useToast();

  const { hasCopied, onCopy } = useClipboard(encodedData || "");

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    try {
      const functionAbi = abi[0];
      if (functionAbi.type !== "function") {
        throw new Error("Invalid ABI: first element is not a function");
      }

      const args = functionAbi.inputs.map((input) => {
        const value = formValues[input.name || ""];
        return parseInputValue(input, value);
      });

      const encoded = encodeFunctionData({
        abi: abi as Abi,
        functionName: functionAbi.name,
        args,
      });

      setEncodedData(encoded);
      toast({
        title: "Data encoded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Encoding failed",
        description: (error as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const parseInputValue = (input: AbiParameter, value: string): any => {
    switch (input.type) {
      case "uint256":
      case "int256":
        return BigInt(value);
      case "bool":
        return value.toLowerCase() === "true";
      case "address":
        return value as `0x${string}`;
      // Add more cases for other types as needed
      default:
        return value;
    }
  };

  if (abi.length === 0 || abi[0].type !== "function") {
    return <Text>No valid install data ABI found.</Text>;
  }

  const functionAbi = abi[0] as Extract<Abi[0], { type: "function" }>;

  return (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Install Data Input</Text>
      {functionAbi.inputs.map((input, index) => (
        <FormControl key={index}>
          <FormLabel>{input.name || `Input ${index + 1}`}</FormLabel>
          <Input
            type="text"
            onChange={(e) =>
              handleInputChange(input.name || "", e.target.value)
            }
            placeholder={input.type}
          />
        </FormControl>
      ))}
      <Button onClick={handleSubmit} colorScheme="blue">
        Encode Install Data
      </Button>
      {encodedData && (
        <Box
          mt={4}
          p={4}
          bg={bgColor}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontWeight="bold">Encoded Result:</Text>
            <Button
              size="sm"
              onClick={onCopy}
              leftIcon={<FaCopy />}
              colorScheme={hasCopied ? "green" : "blue"}
            >
              {hasCopied ? "Copied!" : "Copy"}
            </Button>
          </Flex>
          <Text
            fontSize="sm"
            fontFamily="monospace"
            wordBreak="break-all"
            whiteSpace="pre-wrap"
          >
            {encodedData}
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default InstallDataForm;
