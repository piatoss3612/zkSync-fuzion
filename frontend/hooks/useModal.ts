import { ModalContext } from "@/context";
import { useContext } from "react";

const useModal = () => {
  return useContext(ModalContext);
};

export default useModal;
