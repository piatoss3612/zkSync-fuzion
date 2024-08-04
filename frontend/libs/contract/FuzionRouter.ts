const FUZION_ROUTER_ADDRESS =
  "0x40C0222E7364F3f3ED57A941aAF874E5855be01d" as `0x${string}`;
const FUZION_ROUTER_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "FuzionRouter__PaymasterFactoryNotAvailable",
    type: "error",
  },
  {
    inputs: [],
    name: "FuzionRouter__ZeroAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IPaymasterFactory",
        name: "paymasterFactory",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "paymaster",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "PaymasterCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IPaymasterFactory",
        name: "paymasterFactory",
        type: "address",
      },
    ],
    name: "PaymasterFactorySet",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract IPaymasterFactory",
        name: "_paymasterFactory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "_alias",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "_initData",
        type: "bytes",
      },
    ],
    name: "createPaymaster",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IPaymasterFactory",
        name: "_paymasterFactory",
        type: "address",
      },
    ],
    name: "paymasterFactoryAvailable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IPaymasterFactory",
        name: "_paymasterFactory",
        type: "address",
      },
    ],
    name: "setPaymasterFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export { FUZION_ROUTER_ADDRESS, FUZION_ROUTER_ABI };
