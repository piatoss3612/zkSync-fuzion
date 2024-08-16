import "@nomicfoundation/hardhat-chai-matchers";
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
} from "zksync-ethers/build/utils";
import { AbiCoder, concat, parseEther, randomBytes, Signature } from "ethers";
import { EIP712Signer, Provider, Wallet } from "zksync-ethers";
import { Eip712Meta, Transaction } from "zksync-ethers/build/types";
import { deployFactory } from "./FuzionPaymasterFactory.test";

type ModuleInitDataStruct = {
  validatorType: number;
  isDefault: boolean;
  validatorAddress: string;
  moduleData: string;
};

describe("FuzionPaymaster", function () {
  let provider: Provider;
  let wallet: Wallet;
  let deployer: Deployer;

  before(async function () {
    provider = getProvider();

    wallet = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
    deployer = new Deployer(hre, wallet);
  });

  it("Should deploy FuzionPaymaster", async function () {
    const owner = wallet.address;
    const feeTo = wallet.address;

    // Deploy FuzionPaymaster
    const paymaster = await deployContract("FuzionPaymaster", [owner, feeTo], {
      wallet,
      silent: true,
    });

    // Check if owner and feeTo are set correctly
    expect(await paymaster.owner()).to.be.equal(owner);
    expect(await paymaster.feeTo()).to.be.equal(feeTo);
  });

  it("Should deploy FuzionPaymaster and initialize it with empty data", async function () {
    const owner = wallet.address;
    const feeTo = wallet.address;

    // Deploy FuzionPaymaster
    const paymaster = await deployContract("FuzionPaymaster", [owner, feeTo], {
      wallet,
      silent: true,
    });

    // Initialize FuzionPaymaster with empty data
    await paymaster.initialize("0x");
  });

  it("Should deploy FuzionPaymaster and initialize it with ERC721Gate Module", async function () {
    // Deploy MockERC721
    const mockERC721 = await deployContract("MockERC721", [], {
      wallet,
      silent: true,
    });

    const mockERC721Address = await mockERC721.getAddress();

    // Deploy ERC721Gate Module (it's a validator)
    const erc721Gate = await deployContract("ERC721Gate", [], {
      wallet,
      silent: true,
    });

    const erc721GateAddress = await erc721Gate.getAddress();

    // Deploy FuzionPaymaster
    const owner = wallet.address;
    const feeTo = wallet.address;
    const paymaster = await deployContract("FuzionPaymaster", [owner, feeTo], {
      wallet,
      silent: true,
    });

    const abiCoder = new AbiCoder();

    const moduleData = abiCoder.encode(
      ["address"],
      [mockERC721Address] // MockERC721 address
    );

    const moduleInitData: ModuleInitDataStruct[] = [
      {
        validatorType: 0,
        isDefault: true,
        validatorAddress: erc721GateAddress,
        moduleData: moduleData,
      },
    ];

    const moduleInitDataValues = moduleInitData.map((o) => Object.values(o));

    const initData = abiCoder.encode(
      ["tuple(uint8,bool,address,bytes)[]"],
      [moduleInitDataValues]
    );

    // Initialize FuzionPaymaster with ERC721Gate Module
    await paymaster.initialize(initData);

    // Check if ERC721Gate Module is installed
    expect(await paymaster.isInstalledModule(0, erc721GateAddress)).to.be.true;

    // Check if MockERC721 is registered as a gatekeeper for the paymaster
    expect(
      await erc721Gate.gatekeeperOf(await paymaster.getAddress())
    ).to.be.equal(mockERC721Address);
  });

  it("Should fail to interact with FuzionPaymaster with ERC721Gate without ERC721 token", async function () {
    // Deploy MockERC721
    const mockERC721 = await deployContract("MockERC721", [], {
      wallet,
      silent: true,
    });

    const mockERC721Address = await mockERC721.getAddress();

    // Deploy ERC721Gate Module (it's a validator)
    const erc721Gate = await deployContract("ERC721Gate", [], {
      wallet,
      silent: true,
    });

    const erc721GateAddress = await erc721Gate.getAddress();

    // Deploy FuzionPaymaster
    const owner = wallet.address;
    const feeTo = wallet.address;
    const paymaster = await deployContract("FuzionPaymaster", [owner, feeTo], {
      wallet,
      silent: true,
    });

    const abiCoder = new AbiCoder();

    const moduleData = abiCoder.encode(
      ["address"],
      [mockERC721Address] // MockERC721 address
    );

    const moduleInitData = [
      {
        validatorType: 0,
        isDefault: true,
        validatorAddress: erc721GateAddress,
        moduleData: moduleData,
      },
    ];

    const moduleInitDataValues = moduleInitData.map((o) => Object.values(o));

    const initData = abiCoder.encode(
      ["tuple(uint8,bool,address,bytes)[]"],
      [moduleInitDataValues]
    );

    // Initialize FuzionPaymaster with ERC721Gate Module
    await paymaster.initialize(initData);

    const paymasterAddress = await paymaster.getAddress();

    // Deposit some funds to the paymaster
    await wallet.sendTransaction({
      to: paymasterAddress,
      value: parseEther("0.1"),
    });

    // Get paymaster balance
    const paymasterBalance = await provider.getBalance(paymasterAddress);

    // Check if paymaster balance is correct
    expect(paymasterBalance).to.be.equal(parseEther("0.1"));

    // Deploy Counter contract
    const counter = await deployContract("Counter", [], {
      wallet,
      silent: true,
    });

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
      gasLimit: BigInt(10000000),
      value: BigInt(0),
      customData: {
        gasPerPubdata: DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams,
      } as Eip712Meta,
    };

    const digest = EIP712Signer.getSignedDigest(tx);
    const signature = concat([
      Signature.from(wallet.signingKey.sign(digest)).serialized,
    ]);

    tx.customData = {
      ...tx.customData,
      customSignature: signature,
    };

    // Send the raw transaction
    await expect(provider.broadcastTransaction(Transaction.from(tx).serialized))
      .to.be.reverted;
  });

  it("Should interact with FuzionPaymaster with ERC721Gate with ERC721 token", async function () {
    // Deploy MockERC721
    const mockERC721 = await deployContract("MockERC721", [], {
      wallet,
      silent: true,
    });

    const mockERC721Address = await mockERC721.getAddress();

    // Deploy ERC721Gate Module (it's a validator)
    const erc721Gate = await deployContract("ERC721Gate", [], {
      wallet,
      silent: true,
    });

    const erc721GateAddress = await erc721Gate.getAddress();

    // Deploy FuzionPaymaster
    const owner = wallet.address;
    const feeTo = wallet.address;
    const paymaster = await deployContract("FuzionPaymaster", [owner, feeTo], {
      wallet,
      silent: true,
    });

    const abiCoder = new AbiCoder();

    const moduleData = abiCoder.encode(
      ["address"],
      [mockERC721Address] // MockERC721 address
    );

    const moduleInitData = [
      {
        validatorType: 0,
        isDefault: true,
        validatorAddress: erc721GateAddress,
        moduleData: moduleData,
      },
    ];

    const moduleInitDataValues = moduleInitData.map((o) => Object.values(o));

    const initData = abiCoder.encode(
      ["tuple(uint8,bool,address,bytes)[]"],
      [moduleInitDataValues]
    );

    // Initialize FuzionPaymaster with ERC721Gate Module
    await paymaster.initialize(initData);

    const paymasterAddress = await paymaster.getAddress();

    // Deposit some funds to the paymaster
    await wallet.sendTransaction({
      to: paymasterAddress,
      value: parseEther("0.1"),
    });

    // Get paymaster balance
    const paymasterBalance = await provider.getBalance(paymasterAddress);

    // Check if paymaster balance is correct
    expect(paymasterBalance).to.be.equal(parseEther("0.1"));

    // Mint ERC721 token to the wallet
    await mockERC721.mint(wallet.address, 1);

    // Check if ERC721 token is minted
    expect(await mockERC721.ownerOf(1)).to.be.equal(wallet.address);

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
