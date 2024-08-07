import {
  Drawer as D,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
} from "@chakra-ui/react";
import { NavItem } from "@/types";
import NavigationItem from "./NavigationItem";
import WalletButton from "./WalletButton";

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
        <DrawerHeader>
          <WalletButton />
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={8}>
            {navItems.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
                activePath={activePath}
                handleNavigation={(path: string) => {
                  handleNavigation(path);
                  onClose();
                }}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </D>
  );
};

export default Drawer;
