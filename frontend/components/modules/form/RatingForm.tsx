import React, { useState } from "react";
import { HStack, Select, Button } from "@chakra-ui/react";

interface RatingFormProps {
  onSubmit: (rating: string) => Promise<void>;
  isLoading?: boolean;
}

const ratingOptions = [
  { label: "S", value: "5" },
  { label: "A", value: "4" },
  { label: "B", value: "3" },
  { label: "C", value: "2" },
  { label: "D", value: "1" },
  { label: "F", value: "0" },
];

const RatingForm: React.FC<RatingFormProps> = ({ onSubmit, isLoading }) => {
  const [selectedRating, setSelectedRating] = useState<string>("");

  const handleSubmit = async () => {
    await onSubmit(selectedRating);
    setSelectedRating("");
  };

  return (
    <HStack spacing={4} mt={4}>
      <Select
        placeholder="Select rating"
        value={selectedRating}
        onChange={(e) => setSelectedRating(e.target.value)}
        w="200px"
      >
        {ratingOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} ({option.value})
          </option>
        ))}
      </Select>
      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isDisabled={!selectedRating}
        isLoading={isLoading}
      >
        Submit Rating
      </Button>
    </HStack>
  );
};

export default RatingForm;
