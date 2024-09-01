const FUZION_ROUTER_ADDRESS =
  "0x77af4B00e1E6b9212099AaF7201dECE10074B408" as `0x${string}`;
const FUZION_ROUTER_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_paymasterFactoryAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "module",
        type: "address",
      },
      {
        internalType: "address",
        name: "rater",
        type: "address",
      },
    ],
    name: "FuzionRouter__ModuleAlreadyRated",
    type: "error",
  },
  {
    inputs: [],
    name: "FuzionRouter__ModuleAlreadyRegistered",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "FuzionRouter__ModuleNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "FuzionRouter__NotExpectedPaymaster",
    type: "error",
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
        name: "module",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "rater",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum IFuzionRouter.Rating",
        name: "rating",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalRating",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalCount",
        type: "uint256",
      },
    ],
    name: "ModuleRatingUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "module",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum ModuleType",
        name: "moduleType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "ModuleRegistered",
    type: "event",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "_salt",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeTo",
        type: "address",
      },
    ],
    name: "calculatePaymasterAddress",
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
        internalType: "bytes32",
        name: "_salt",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeTo",
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
    name: "factory",
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
        internalType: "address",
        name: "_module",
        type: "address",
      },
    ],
    name: "getModuleRatingData",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "accumulativeRating",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "accumulativeRatingCount",
            type: "uint128",
          },
        ],
        internalType: "struct IFuzionRouter.RatingData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rater",
        type: "address",
      },
      {
        internalType: "address",
        name: "_module",
        type: "address",
      },
    ],
    name: "hasRatedModule",
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
    inputs: [
      {
        internalType: "address",
        name: "_module",
        type: "address",
      },
    ],
    name: "isModuleRegistered",
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
        internalType: "address",
        name: "_module",
        type: "address",
      },
      {
        internalType: "enum IFuzionRouter.Rating",
        name: "_rating",
        type: "uint8",
      },
    ],
    name: "rateModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_module",
        type: "address",
      },
    ],
    name: "registerModule",
    outputs: [],
    stateMutability: "nonpayable",
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
