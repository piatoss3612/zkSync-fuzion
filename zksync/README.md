# Hardhat zkSync

## Deployment

### Deploying the Gasless Paymaster

```bash
$ yarn hardhat deploy-zksync --script deployGaslessPaymaster.ts
```

### Deploying the Gasless Paymaster Factory

```bash
$ yarn hardhat deploy-zksync --script deployGaslessPaymasterFactory.ts
yarn run v1.22.22

"GaslessPaymasterFactory" was successfully deployed:
 - Contract address: 0x1cBa868B876cB00140a43895246559b2e5E129c9
 - Contract source: contracts/GaslessPaymasterFactory.sol:GaslessPaymasterFactory
 - Encoded constructor arguments: 0x

Requesting contract verification...
Your verification ID is: 21662
Contract successfully verified on ZKsync block explorer!
Done in 12.69s.
```

### Interacting with the Gasless Paymaster

```bash
$ yarn hardhat deploy-zksync --script interactWithGaslessPaymaster.ts
```

### Deploying the Fuzion Router

```bash
$ yarn hardhat deploy-zksync --script deployFuzionRouter.ts
yarn run v1.22.22

Starting deployment process of "FuzionRouter"...
Estimated deployment cost: 0.018844268833765838 ETH

"FuzionRouter" was successfully deployed:
 - Contract address: 0x40C0222E7364F3f3ED57A941aAF874E5855be01d
 - Contract source: contracts/FuzionRouter.sol:FuzionRouter
 - Encoded constructor arguments: 0x000000000000000000000000965b0e63e00e7805569ee3b428cf96330dfc57ef

Requesting contract verification...
Your verification ID is: 21663
Contract successfully verified on ZKsync block explorer!
Done in 15.45s.
```
