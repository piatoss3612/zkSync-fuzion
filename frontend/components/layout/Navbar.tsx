"use client";

import {
  Flex,
  Box,
  Text,
  Image,
  Link,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Logo from "@/public/logo.png";
import NextLink from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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
        <NextLink href="/" passHref>
          <Link
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: "none" }}
            mr={4}
          >
            <Image src={Logo.src} boxSize="64px" alt="Fuzion Logo" />
            <Text fontSize="3xl" fontWeight="bold" ml={2}>
              Fuzion
            </Text>
          </Link>
        </NextLink>

        <Box
          display={{ base: "none", lg: "flex" }}
          width={{ base: "full", lg: "auto" }}
          alignItems="center"
          flexGrow={1}
          ml={4}
        >
          <NextLink href="/dashboard" passHref>
            <Link mx="4" _hover={{ textDecoration: "underline" }}>
              Dashboard
            </Link>
          </NextLink>
        </Box>

        <Box display={{ base: "none", lg: "block" }}>
          <ConnectButton />
        </Box>

        <IconButton
          display={{ lg: "none" }}
          icon={<HamburgerIcon />}
          onClick={onOpen}
          aria-label="Open menu"
        />
      </Flex>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody mt={2}>
            <VStack spacing="24px">
              <ConnectButton />
              <NextLink href="/" passHref>
                <Link onClick={onClose}>Home</Link>
              </NextLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
