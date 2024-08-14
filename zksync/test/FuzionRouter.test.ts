import { expect } from "chai";
import {
  deployContract,
  getProvider,
  getWallet,
  LOCAL_RICH_WALLETS,
} from "../deploy/utils";
import hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { DEFAULT_GAS_PER_PUBDATA_LIMIT } from "zksync-ethers/build/utils";
import { concat, parseEther, randomBytes, Signature } from "ethers";
import { EIP712Signer, Provider, Wallet } from "zksync-ethers";
import { Eip712Meta, Transaction } from "zksync-ethers/build/types";
import { deployFactory } from "./FuzionPaymasterFactory.test";

describe("FuzionRouter", function () {
  let provider: Provider;
  let wallet: Wallet;
  let deployer: Deployer;

  before(async function () {
    provider = getProvider();

    wallet = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
    deployer = new Deployer(hre, wallet);
  });

  it("Should deploy FuzionRouter", async function () {
    const factory = await deployFactory(
      deployer,
      "FuzionPaymasterFactory",
      "FuzionPaymaster"
    );

    const factoryAddress = await factory.getAddress();

    const router = await deployContract(
      "FuzionRouter",
      [factoryAddress, wallet.address],
      {
        wallet,
        silent: true,
      }
    );

    expect(await router.factory()).to.be.equal(factoryAddress);
    expect(await router.owner()).to.be.equal(wallet.address);
  });

  it("Should deploy FuzionRouter and call createPaymaster without init data", async function () {
    const factory = await deployFactory(
      deployer,
      "FuzionPaymasterFactory",
      "FuzionPaymaster"
    );

    const factoryAddress = await factory.getAddress();

    const router = await deployContract(
      "FuzionRouter",
      [factoryAddress, wallet.address],
      {
        wallet,
        silent: true,
      }
    );

    const salt = randomBytes(32);
    const owner = wallet.address;
    const feeTo = wallet.address;
    const alias = "MyPaymaster";
    const initData = "0x";

    const paymasterAddress = await factory.getPaymasterAddress(
      salt,
      owner,
      feeTo
    );

    const tx = await router.createPaymaster(
      salt,
      owner,
      feeTo,
      alias,
      initData,
      {
        value: parseEther("0.1"),
      }
    );

    const receipt = await tx.wait();

    expect(receipt.contractAddress).to.be.equal(paymasterAddress);

    const paymasterBalance = await provider.getBalance(paymasterAddress);

    expect(paymasterBalance).to.be.equal(parseEther("0.1"));
  });

  it("Should create a paymaster and interact with it", async function () {
    const factory = await deployFactory(
      deployer,
      "FuzionPaymasterFactory",
      "FuzionPaymaster"
    );

    const factoryAddress = await factory.getAddress();

    const router = await deployContract(
      "FuzionRouter",
      [factoryAddress, wallet.address],
      {
        wallet,
        silent: true,
      }
    );

    const salt = randomBytes(32);
    const owner = wallet.address;
    const feeTo = wallet.address;
    const alias = "MyPaymaster";
    const initData = "0x";

    const paymasterAddress = await factory.getPaymasterAddress(
      salt,
      owner,
      feeTo
    );

    await router.createPaymaster(salt, owner, feeTo, alias, initData, {
      value: parseEther("0.1"),
    });

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

  // TODO: register module
  // TODO: init module on createPaymaster
});
