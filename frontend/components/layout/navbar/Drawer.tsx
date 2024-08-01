import {
  Drawer as D,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  Text,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NavItem } from "@/types";
import { useRouter } from "next/navigation";
import NavigationItem from "./NavigationItem";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  activePath: string;
  handleNavigation: (path: string) => void;
}

const Drawer = ({
  isOpen,
  onClose,
  navItems,
  activePath,
  handleNavigation,
}: DrawerProps) => {
  return (
    <D isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
        <DrawerBody mt={2}>
          <VStack spacing="24px">
            <ConnectButton />
            {navItems.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
                activePath={activePath}
                handleNavigation={handleNavigation}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </D>
  );
};

export default Drawer;
