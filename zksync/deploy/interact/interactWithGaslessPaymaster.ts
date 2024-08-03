import * as hre from "hardhat";
import { getWallet, getProvider } from "../utils";
import { assert, concat, ethers, Signature } from "ethers";
import { EIP712Signer, types, utils } from "zksync-ethers";

// Address of the contract to interact with
const CONTRACT_ADDRESS = "0x42d625D2A7142F55952d8B63a5FCa907656c2887"; // Counter contract
const PAYMASTER_ADDRESS = "0x0B7B0D35F6Bc700cE601A0B1091A82335B5a0C15"; // GaslessPaymaster
if (!CONTRACT_ADDRESS || !PAYMASTER_ADDRESS)
  throw new Error("Contract and Paymaster addresses are required.");

export default async function () {
  console.log(
    `Running script to interact with contract ${CONTRACT_ADDRESS} using paymaster ${PAYMASTER_ADDRESS}`
  );

  const wallet = getWallet();
  const provider = getProvider();

  // Load contract artifact
  const contractArtifact = await hre.artifacts.readArtifact("Counter");

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    wallet
  );

  // Get the current count
  const countBefore = BigInt(await contract.count());

  console.log(`Counter count before: ${countBefore.toString()}`);

  // Prepare the transaction to increment the counter with paymaster
  let tx = await contract.increment.populateTransaction();

  const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
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
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    } as types.Eip712Meta,
  };

  tx.gasLimit = await provider.estimateGas(tx);

  // Get the signed message
  const digest = EIP712Signer.getSignedDigest(tx);

  // Sign the message with the wallet private key
  const signature = concat([
    Signature.from(wallet.signingKey.sign(digest)).serialized,
  ]);

  tx.customData = {
    ...tx.customData,
    customSignature: signature,
  };

  console.log(`Sending increment transaction...`);

  // Send the raw transaction
  const sentTx = await provider.broadcastTransaction(
    types.Transaction.from(tx).serialized
  );

  await sentTx.wait();

  console.log(`Transaction sent: ${sentTx.hash}`);

  // Get the count after the increment
  const countAfter = BigInt(await contract.count());

  console.log(`Counter count after: ${countAfter.toString()}`);

  // Check if the counter was incremented by 1
  if (countAfter !== countBefore + BigInt(1)) {
    throw new Error("Counter was not incremented by 1");
  }

  console.log(`Counter was incremented by 1`);
}
