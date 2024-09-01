import { NavItem } from "@/types";
import { Text } from "@chakra-ui/react";
import React from "react";

interface NavigationItemProps {
  item: NavItem;
  activePath: string;
  handleNavigation: (path: string) => void;
  mx?: number;
}

const NavigationItem = ({
  item,
  activePath,
  handleNavigation,
  mx = 0,
}: NavigationItemProps) => {
  const trimmedPath = item.path.split("/")[1] || "/";

  return (
    <Text
      key={item.name}
      mx={mx}
      _hover={{ color: "blue.500" }}
      fontSize="xl"
      fontWeight="bold"
      cursor="pointer"
      onClick={() => handleNavigation(item.path)}
      color={activePath === `/${trimmedPath}` ? "blue.500" : "inherit"}
    >
      {item.name}
    </Text>
  );
};

export default NavigationItem;
