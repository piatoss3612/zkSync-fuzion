interface NavItem {
  name: string;
  path: string;
}

interface PaymasterCreated {
  id: string;
  name: string;
  owner: `0x${string}`;
  paymaster: `0x${string}`;
  blockTimestamp: number;
}

interface PaymasterCreateds {
  paymasterCreateds: PaymasterCreated[];
}

enum ModuleType {
  Validator = 0,
  Payport = 1,
  Hook = 2,
}

interface ModuleRegistered {
  id: string;
  module: `0x${string}`;
  moduleType: ModuleType;
  blockTimestamp: number;
}

interface ModuleRegistereds {
  moduleRegistereds: ModuleRegistered[];
}

interface ModuleMetadata {
  moduleType: number;
  name: string;
  version: string;
  author: string;
  installDataSignature: string;
}

export {
  NavItem,
  PaymasterCreated,
  PaymasterCreateds,
  ModuleType,
  ModuleRegistered,
  ModuleRegistereds,
  ModuleMetadata,
};
