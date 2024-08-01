import { Box } from "@chakra-ui/react";
import { NavItem } from "@/types";
import NavigationItem from "./NavigationItem";

interface NavigationProps {
  navItems: NavItem[];
  activePath: string;
  handleNavigation: (path: string) => void;
}

const Navigation = ({
  navItems,
  activePath,
  handleNavigation,
}: NavigationProps) => {
  return (
    <Box
      display={{ base: "none", lg: "flex" }}
      width={{ base: "full", lg: "auto" }}
      alignItems="center"
      flexGrow={1}
      ml={8}
    >
      {navItems.map((item) => (
        <NavigationItem
          key={item.name}
          item={item}
          activePath={activePath}
          handleNavigation={handleNavigation}
          mx={2}
        />
      ))}
    </Box>
  );
};

export default Navigation;
