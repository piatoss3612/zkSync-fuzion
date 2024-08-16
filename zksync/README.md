# Hardhat zkSync

## Testing

### Running the tests

```bash
$ yarn hardhat test
```

## Deployment

### Deploying the FuzionPaymasterFactory

```bash
$ yarn hardhat deploy-zksync --script deployFuzionPaymasterFactory.ts
yarn run v1.22.22

Factory deployed at 0xA6eb2386aecb4673bc039cf89F21f77c4CcB10c7
Verifying factory contract on Block Explorer...
Your verification ID is: 22819
Contract successfully verified on ZKsync block explorer!
Successfully verified factory contract!
Done in 13.76s.
```

### Deploying the FuzionRouter

```bash
$ yarn hardhat deploy-zksync --script deployFuzionRouter.ts
yarn run v1.22.22

Starting deployment process of "FuzionRouter"...
Estimated deployment cost: 0.0000078348 ETH

"FuzionRouter" was successfully deployed:
 - Contract address: 0x238C6C2b4163e931C2b72aFC6D44FbF77845e1A3
 - Contract source: contracts/FuzionRouter.sol:FuzionRouter
 - Encoded constructor arguments: 0x000000000000000000000000a6eb2386aecb4673bc039cf89f21f77c4ccb10c7000000000000000000000000965b0e63e00e7805569ee3b428cf96330dfc57ef

Requesting contract verification...
Your verification ID is: 22821
Contract successfully verified on ZKsync block explorer!
Done in 13.38s.
```
