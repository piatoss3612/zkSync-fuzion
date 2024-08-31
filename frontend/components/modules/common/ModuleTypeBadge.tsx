import { Badge, BadgeProps } from "@chakra-ui/react";

interface ModuleTypeBadgeProps extends Omit<BadgeProps, "colorScheme"> {
  moduleType: number;
  size?: string;
  width?: string;
}

const ModuleTypeBadge = ({
  moduleType,
  size = "md",
  width,
  ...props
}: ModuleTypeBadgeProps) => {
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
    <Badge
      colorScheme={color}
      variant="solid"
      borderRadius="full"
      px={2}
      fontSize={size}
      width={width}
      fontFamily={""}
      {...props}
    >
      {label}
    </Badge>
  );
};

export default ModuleTypeBadge;
