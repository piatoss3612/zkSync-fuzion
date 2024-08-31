const FUZION_PAYMASTER_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeToAddress",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
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
    name: "AddressInsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "DefaultModuleCannotBeDeleted",
    type: "error",
  },
  {
    inputs: [],
    name: "FailToTransferFee",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedToTransferFundsToBootloader",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedToWithdrawFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedToWithdrawTokenFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "InvalidModuleType",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPaymasterInput",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "ModuleAlreadyInstalled",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyBootloader",
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
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "TooManyValidators",
    type: "error",
  },
  {
    inputs: [],
    name: "UnsupportedPaymasterFlow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "ValidationFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum ModuleType",
        name: "moduleType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "DefaultModuleSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "validators",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "payport",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "hook",
        type: "address",
      },
    ],
    name: "DefaultModulesSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "feeTo",
        type: "address",
      },
    ],
    name: "FeeToSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum ModuleType",
        name: "moduleType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "ModuleInstalled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum ModuleType",
        name: "moduleType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "ModuleUninstalled",
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
    inputs: [],
    name: "defaultHook",
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
    inputs: [],
    name: "defaultPayport",
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
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "defaultValidator",
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
    inputs: [],
    name: "defaultValidators",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeTo",
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
        internalType: "bytes",
        name: "_initData",
        type: "bytes",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ModuleType",
        name: "moduleType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_module",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_initData",
        type: "bytes",
      },
    ],
    name: "installModule",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ModuleType",
        name: "moduleType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_module",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_initData",
        type: "bytes",
      },
    ],
    name: "installModuleAndSetDefault",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ModuleType",
        name: "moduleType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_module",
        type: "address",
      },
    ],
    name: "isInstalledModule",
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
        internalType: "bytes",
        name: "_context",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256[4]",
            name: "reserved",
            type: "uint256[4]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "_transaction",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "_txHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_suggestedSignedHash",
        type: "bytes32",
      },
      {
        internalType: "enum ExecutionResult",
        name: "_txResult",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_maxRefundedGas",
        type: "uint256",
      },
    ],
    name: "postTransaction",
    outputs: [],
    stateMutability: "payable",
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
        internalType: "enum ModuleType",
        name: "moduleType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_module",
        type: "address",
      },
    ],
    name: "setDefaultModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_validators",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_payport",
        type: "address",
      },
      {
        internalType: "address",
        name: "_hook",
        type: "address",
      },
    ],
    name: "setDefaultModules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeToAddress",
        type: "address",
      },
    ],
    name: "setFeeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
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
  {
    inputs: [
      {
        internalType: "enum ModuleType",
        name: "moduleType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_module",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_forceDelete",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "_deletionData",
        type: "bytes",
      },
    ],
    name: "uninstallModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_txHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_suggestedSignedHash",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256[4]",
            name: "reserved",
            type: "uint256[4]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "_transaction",
        type: "tuple",
      },
    ],
    name: "validateAndPayForPaymasterTransaction",
    outputs: [
      {
        internalType: "bytes4",
        name: "magic",
        type: "bytes4",
      },
      {
        internalType: "bytes",
        name: "context",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

export { FUZION_PAYMASTER_ABI };
