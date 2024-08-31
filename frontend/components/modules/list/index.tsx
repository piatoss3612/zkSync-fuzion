import { Box, SimpleGrid, Text, Spinner } from "@chakra-ui/react";
import React from "react";
import { ModuleRegistered } from "@/types";
import ModuleCard from "../card";

interface ModuleListProps {
  modules: ModuleRegistered[];
  isLoading: boolean;
}

const ModuleList = ({ modules, isLoading }: ModuleListProps) => {
  if (modules.length === 0) {
    return (
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        {isLoading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Text
            textAlign="center"
            fontSize="lg"
            color="gray.500"
            fontWeight="semibold"
          >
            No modules found
          </Text>
        )}
      </Box>
    );
  }

  return (
    <SimpleGrid
      columns={[1, 1, 2, 2, 3]}
      gap={6}
      w="full"
      justifyItems="center"
    >
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </SimpleGrid>
  );
};

export default ModuleList;
