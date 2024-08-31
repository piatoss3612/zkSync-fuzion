import { Badge } from "@chakra-ui/react";

const ModuleTypeBadge = ({ moduleType }: { moduleType: number }) => {
  let color: string;
  let label: string;

  switch (moduleType) {
    case 0:
      color = "green";
      label = "Validator";
      break;
    case 1:
      color = "blue";
      label = "Payport";
      break;
    case 2:
      color = "purple";
      label = "Hook";
      break;
    default:
      color = "gray";
      label = "Unknown";
  }

  return (
    <Badge colorScheme={color} variant="solid" borderRadius="full" px={2}>
      {label}
    </Badge>
  );
};

export default ModuleTypeBadge;
