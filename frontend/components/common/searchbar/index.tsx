import { Search2Icon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
  width?: string;
  isDisabled?: boolean;
}

const SearchBar = ({
  placeholder,
  value,
  onChange,
  size,
  width,
  isDisabled,
}: SearchBarProps) => {
  return (
    <InputGroup size={size} width={width}>
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="gray.500" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        isDisabled={isDisabled}
      />
    </InputGroup>
  );
};

export default SearchBar;
