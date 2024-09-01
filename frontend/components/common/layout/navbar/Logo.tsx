import { Text, Image, Link } from "@chakra-ui/react";
import LogoImage from "@/public/logo.png";
import NextLink from "next/link";

const Logo = () => {
  return (
    <NextLink href="/" passHref>
      <Link
        display="flex"
        alignItems="center"
        _hover={{ textDecoration: "none" }}
      >
        <Image src={LogoImage.src} boxSize="64px" alt="Fuzion Logo" />
        <Text fontSize="4xl" fontWeight="bold" ml={3}>
          Fuzion
        </Text>
      </Link>
    </NextLink>
  );
};

export default Logo;
