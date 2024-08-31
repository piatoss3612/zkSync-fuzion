import React from "react";
import {
  VStack,
  Button,
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ModuleInitData } from "@/types";

interface ModuleInitDataListProps {
  moduleInitDataList: ModuleInitData[];
  setModuleInitDataList: React.Dispatch<React.SetStateAction<ModuleInitData[]>>;
}

const ModuleInitDataList: React.FC<ModuleInitDataListProps> = ({
  moduleInitDataList,
  setModuleInitDataList,
}) => {
  const addModuleInitData = () => {
    setModuleInitDataList([
      ...moduleInitDataList,
      { moduleType: 0, isDefault: false, module: "0x", initData: "0x" },
    ]);
  };

  const removeModuleInitData = (index: number) => {
    setModuleInitDataList(moduleInitDataList.filter((_, i) => i !== index));
  };

  const updateModuleInitData = (
    index: number,
    field: keyof ModuleInitData,
    value: any
  ) => {
    const updatedList = [...moduleInitDataList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setModuleInitDataList(updatedList);
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold">Module Init Data</Text>
        <Button leftIcon={<FaPlus />} onClick={addModuleInitData} size="sm">
          Add Module
        </Button>
      </Flex>
      {moduleInitDataList.map((moduleInitData, index) => (
        <Box key={index} p={4} borderWidth={1} borderRadius="md">
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontWeight="bold">Module {index + 1}</Text>
            <IconButton
              icon={<FaTrash />}
              onClick={() => removeModuleInitData(index)}
              aria-label="Remove module"
              size="sm"
            />
          </Flex>
          <FormControl>
            <FormLabel>Module Type</FormLabel>
            <Select
              value={moduleInitData.moduleType}
              onChange={(e) =>
                updateModuleInitData(
                  index,
                  "moduleType",
                  Number(e.target.value)
                )
              }
            >
              <option value={0}>Validator</option>
              <option value={1}>Payport</option>
              <option value={2}>Hook</option>
            </Select>
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Module Address</FormLabel>
            <Input
              value={moduleInitData.module}
              onChange={(e) =>
                updateModuleInitData(index, "module", e.target.value)
              }
            />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Init Data</FormLabel>
            <Input
              value={moduleInitData.initData}
              onChange={(e) =>
                updateModuleInitData(index, "initData", e.target.value)
              }
            />
          </FormControl>
          <Checkbox
            mt={2}
            isChecked={moduleInitData.isDefault}
            onChange={(e) =>
              updateModuleInitData(index, "isDefault", e.target.checked)
            }
          >
            Set as Default
          </Checkbox>
        </Box>
      ))}
    </VStack>
  );
};

export default ModuleInitDataList;
