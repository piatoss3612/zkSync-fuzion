import {
  Button,
  Center,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import {
  CheckCircleIcon,
  ExternalLinkIcon,
  WarningIcon,
} from "@chakra-ui/icons";

interface ResultModalProps {
  onClose: () => void;
  isOpen: boolean;
  status: "success" | "error";
  header: string;
  subheader: string;
  content: React.ReactNode;
}

const ResultModal = ({
  onClose,
  isOpen,
  status,
  header,
  subheader,
  content,
}: ResultModalProps) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      size={{ base: "md", md: "lg" }}
      trapFocus={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Center m={4}>
            <Stack spacing={4} justify="center" align="center">
              {status === "success" ? (
                <>
                  <CheckCircleIcon
                    name="check-circle"
                    color="green.500"
                    boxSize={"2.4rem"}
                  />
                  <Text fontWeight="bold" textAlign="center">
                    {subheader}
                  </Text>
                </>
              ) : (
                <>
                  <WarningIcon
                    name="warning"
                    color="red.500"
                    boxSize={"2.4rem"}
                  />
                  <Text>Transaction Reverted</Text>
                </>
              )}
              {content}
            </Stack>
          </Center>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResultModal;
