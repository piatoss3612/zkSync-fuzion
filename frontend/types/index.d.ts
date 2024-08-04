interface NavItem {
  name: string;
  path: string;
}

interface PaymasterCreated {
  id: string;
  name: string;
  owner: `0x${string}`;
  paymaster: `0x${string}`;
  paymasterFactory: `0x${string}`;
  blockTimestamp: number;
}

interface PaymasterCreateds {
  paymasterCreateds: PaymasterCreated[];
}

export { NavItem, PaymasterCreated, PaymasterCreateds };
