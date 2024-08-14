import { expect } from "chai";
import {
  deployContract,
  getProvider,
  getWallet,
  LOCAL_RICH_WALLETS,
} from "../deploy/utils";
import hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync";
import {
  DEFAULT_GAS_PER_PUBDATA_LIMIT,
  hashBytecode,
} from "zksync-ethers/build/utils";
import { concat, Contract, parseEther, randomBytes, Signature } from "ethers";
import { EIP712Signer, Provider, Wallet } from "zksync-ethers";
import { Eip712Meta, Transaction } from "zksync-ethers/build/types";

describe("FuzionPaymasterFactory", function () {
  let provider: Provider;
  let wallet: Wallet;
  let deployer: Deployer;

  async function deployFactory(
    deployer: Deployer,
    factoryArtifactName: string,
    contractArtifactName: string
  ): Promise<Contract> {
    const factoryArtifact = await deployer.loadArtifact(factoryArtifactName);
    const contractArtifact = await deployer.loadArtifact(contractArtifactName);

    const contractBytecodeHash = hashBytecode(contractArtifact.bytecode);

    const factory = await deployer.deploy(
      factoryArtifact,
      [contractBytecodeHash],
      undefined,
      undefined,
      [contractArtifact.bytecode]
    );

    return factory;
  }

  before(async function () {
    provider = getProvider();

    wallet = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
    deployer = new Deployer(hre, wallet);
  });

  it("Should deploy FuzionPaymasterFactory and create a paymaster", async function () {
    const factory = await deployFactory(
      deployer,
      "FuzionPaymasterFactory",
      "FuzionPaymaster"
    );

    const salt = randomBytes(32);
    const owner = wallet.address;
    const feeTo = wallet.address;

    const expectedPaymasterAddress = await factory.getPaymasterAddress(
      salt,
      owner,
      feeTo
    );

    const tx = await factory.createPaymaster(salt, owner, feeTo);
    const receipt = await tx.wait();

    const actualPaymasterAddress = receipt.contractAddress;

    expect(actualPaymasterAddress).to.be.equal(expectedPaymasterAddress);
  });

  it("Should create a paymaster and interact with it", async function () {
    const factory = await deployFactory(
      deployer,
      "FuzionPaymasterFactory",
      "FuzionPaymaster"
    );

    const salt = randomBytes(32);
    const owner = wallet.address;
    const feeTo = wallet.address;

    const paymasterAddress = await factory.getPaymasterAddress(
      salt,
      owner,
      feeTo
    );

    await await factory.createPaymaster(salt, owner, feeTo);

    await wallet.sendTransaction({
      to: paymasterAddress,
      value: parseEther("0.1"),
    });

    const balance = await provider.getBalance(paymasterAddress);

    expect(balance).to.be.equal(parseEther("0.1"));

    const counter = await deployContract("Counter", [], {
      wallet,
      silent: true,
    });

    const countBefore = BigInt(await counter.count());

    let tx = await counter.increment.populateTransaction();

    tx = {
      ...tx,
      from: wallet.address,
      chainId: (await provider.getNetwork()).chainId,
      nonce: await provider.getTransactionCount(wallet.address),
      type: 113,
      gasPrice: await provider.getGasPrice(),
      value: BigInt(0),
      customData: {
        gasPerPubdata: DEFAULT_GAS_PER_PUBDATA_LIMIT,
      } as Eip712Meta,
    };

    tx.gasLimit = await provider.estimateGas(tx);

    const digest = EIP712Signer.getSignedDigest(tx);
    const signature = concat([
      Signature.from(wallet.signingKey.sign(digest)).serialized,
    ]);

    tx.customData = {
      ...tx.customData,
      customSignature: signature,
    };

    const sentTx = await provider.broadcastTransaction(
      Transaction.from(tx).serialized
    );

    await sentTx.wait();

    const countAfter = BigInt(await counter.count());

    expect(countAfter).to.be.equal(countBefore + BigInt(1));
  });
});
