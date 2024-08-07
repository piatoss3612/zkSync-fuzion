import Modal from "@/components/common/modal";
import { useDisclosure } from "@chakra-ui/react";
import { createContext, useState } from "react";

interface ModalContextValues {
  openModal: (
    header: string,
    content?: React.ReactNode,
    callback?: () => void
  ) => void;
}

const ModalContext = createContext({} as ModalContextValues);

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [callback, setCallback] = useState<() => void>(() => () => {});
  const [header, setHeader] = useState<string>("");
  const [content, setContent] = useState<React.ReactNode>(() => <></>);

  const handleClose = () => {
    onClose();
    callback();
  };

  const openModal = (
    header: string,
    content?: React.ReactNode,
    callback?: () => void
  ) => {
    setCallback(() => callback);
    setHeader(header);
    setContent(content || <></>);
    onOpen();
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
      }}
    >
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        header={header}
        content={content}
      />
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
