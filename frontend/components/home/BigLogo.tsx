import { Flex, Image } from "@chakra-ui/react";
import HeroImage from "@/public/logo.png";

const BigLogo = () => {
  return (
    <Flex justify={"center"} align={"center"}>
      <Image
        src={HeroImage.src}
        alt={"Hero Image"}
        fit={"contain"}
        align={"center"}
        w={"60%"}
        h={"60%"}
      />
    </Flex>
  );
};

export default BigLogo;
