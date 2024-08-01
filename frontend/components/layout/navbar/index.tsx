"use client";

import { Flex, Box, useDisclosure, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Logo from "./Logo";
import { NavItem } from "@/types";
import Navigation from "./Navigation";
import Drawer from "./Drawer";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import WalletButton from "./WalletButton";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState<string>("");

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const trimmedPath = pathname.split("/")[1] || "/";
    setActivePath(trimmedPath === "/" ? "/" : `/${trimmedPath}`);
  }, [pathname]);

  const navItems: NavItem[] = [
    {
      name: "Paymasters",
      path: "/paymasters",
    },
  ];

  return (
    <Flex
      as="nav"
      align="center"
      justify={{ base: "space-between" }}
      wrap="wrap"
      px="1.6rem"
      top="0"
      left="0"
      right="0"
      zIndex="banner"
    >
      <Logo />
      <Navigation
        navItems={navItems}
        activePath={activePath}
        handleNavigation={handleNavigation}
      />
      <Box display={{ base: "none", lg: "block" }}>
        <WalletButton />
      </Box>
      <IconButton
        display={{ lg: "none" }}
        icon={<HamburgerIcon />}
        onClick={onOpen}
        aria-label="Open menu"
        fontSize={"xl"}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        navItems={navItems}
        activePath={activePath}
        handleNavigation={handleNavigation}
      />
    </Flex>
  );
};

export default Navbar;
