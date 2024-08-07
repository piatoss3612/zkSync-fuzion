import {
  Button,
  Center,
  Modal as M,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  header: string;
  content?: React.ReactNode;
}

const Modal = ({ onClose, isOpen, header, content }: ModalProps) => {
  return (
    <M
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
          <Center m={4}>{content}</Center>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </M>
  );
};

export default Modal;
