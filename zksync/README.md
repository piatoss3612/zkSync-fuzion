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

Factory deployed at 0x82e7Fc2D13ee7515f182D445974e0788A181d7AC
Verifying factory contract on Block Explorer...
Your verification ID is: 24155
Contract successfully verified on ZKsync block explorer!
Successfully verified factory contract!
Done in 58.81s.
```

### Deploying the FuzionRouter

```bash
$  yarn hardhat deploy-zksync --script deployFuzionRouter.ts
yarn run v1.22.22

Starting deployment process of "FuzionRouter"...
Estimated deployment cost: 0.002532147 ETH

"FuzionRouter" was successfully deployed:
 - Contract address: 0x77af4B00e1E6b9212099AaF7201dECE10074B408
 - Contract source: contracts/FuzionRouter.sol:FuzionRouter
 - Encoded constructor arguments: 0x00000000000000000000000082e7fc2d13ee7515f182d445974e0788a181d7ac000000000000000000000000965b0e63e00e7805569ee3b428cf96330dfc57ef

Requesting contract verification...
Your verification ID is: 24450
Contract successfully verified on ZKsync block explorer!
Done in 16.68s.
```

### Deploying the ERC721Gate Module

```bash
$ yarn hardhat deploy-zksync --script deployERC721GateModule.ts
yarn run v1.22.22

Starting deployment process of "ERC721Gate"...
Estimated deployment cost: 0.0096990844 ETH

"ERC721Gate" was successfully deployed:
 - Contract address: 0xC2f7918bB15917cfbc4b664d89aE73bDfCE8E391
 - Contract source: contracts/modules/ERC721Gate.sol:ERC721Gate
 - Encoded constructor arguments: 0x

Requesting contract verification...
Your verification ID is: 24159
Contract successfully verified on ZKsync block explorer!
Done in 14.24s.
```

### Deploying the MockERC721

```bash
$ yarn hardhat deploy-zksync --script deployMockERC721.ts
yarn run v1.22.22

Starting deployment process of "MockERC721"...
Estimated deployment cost: 0.0031611735 ETH

"MockERC721" was successfully deployed:
 - Contract address: 0xfa2194Bbd8b18233Fb69204736cBB7770eBfFD72
 - Contract source: contracts/mock/MockERC721.sol:MockERC721
 - Encoded constructor arguments: 0x

Requesting contract verification...
Your verification ID is: 24456
Contract successfully verified on ZKsync block explorer!
Done in 12.69s.
```
