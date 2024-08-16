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
  getPaymasterParams,
  hashBytecode,
} from "zksync-ethers/build/utils";
import { concat, Contract, parseEther, randomBytes, Signature } from "ethers";
import { EIP712Signer, Provider, Wallet } from "zksync-ethers";
import { Eip712Meta, Transaction } from "zksync-ethers/build/types";

export async function deployFactory(
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

describe("FuzionPaymasterFactory", function () {
  let provider: Provider;
  let wallet: Wallet;
  let deployer: Deployer;

  before(async function () {
    provider = getProvider();

    wallet = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
    deployer = new Deployer(hre, wallet);
  });

  it("Should deploy FuzionPaymasterFactory and create a paymaster", async function () {
    // Deploy Factory
    const factory = await deployFactory(
      deployer,
      "FuzionPaymasterFactory",
      "FuzionPaymaster"
    );

    const salt = randomBytes(32);
    const owner = wallet.address;
    const feeTo = wallet.address;

    // Get expected paymaster address
    const expectedPaymasterAddress = await factory.getPaymasterAddress(
      salt,
      owner,
      feeTo
    );

    // Create paymaster
    const tx = await factory.createPaymaster(salt, owner, feeTo);
    const receipt = await tx.wait();

    // Get actual paymaster address
    const actualPaymasterAddress = receipt.contractAddress;

    // Check if paymaster address is correct
    expect(actualPaymasterAddress).to.be.equal(expectedPaymasterAddress);
  });

  it("Should create a paymaster and interact with it", async function () {
    // Deploy Factory
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

    // Create paymaster with some deposit
    await await factory.createPaymaster(salt, owner, feeTo, {
      value: parseEther("0.1"),
    });

    // Get paymaster balance
    const balance = await provider.getBalance(paymasterAddress);

    // Check if paymaster has the deposit
    expect(balance).to.be.equal(parseEther("0.1"));

    // Deploy Counter contract
    const counter = await deployContract("Counter", [], {
      wallet,
      silent: true,
    });

    // Get count before increment
    const countBefore = BigInt(await counter.count());

    // Increment count
    let tx = await counter.increment.populateTransaction();

    const paymasterParams = getPaymasterParams(paymasterAddress, {
      type: "General",
      innerInput: new Uint8Array(),
    });

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
        paymasterParams,
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

    // Send the raw transaction
    const sentTx = await provider.broadcastTransaction(
      Transaction.from(tx).serialized
    );

    await sentTx.wait();

    // Get count after increment
    const countAfter = BigInt(await counter.count());

    // Check if count is incremented
    expect(countAfter).to.be.equal(countBefore + BigInt(1));
  });
});
