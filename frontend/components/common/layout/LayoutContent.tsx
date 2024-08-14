import { Box } from "@chakra-ui/react";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display="flex" flexGrow={1}>
      {children}
    </Box>
  );
};

export default LayoutContent;
