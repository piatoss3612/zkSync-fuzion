import { deployContract, getWallet, getProvider } from "./utils";
import { ethers } from "ethers";

export default async function () {
  const wallet = getWallet();
  const provider = getProvider();

  const contractArtifactName = "GaslessPaymaster";
  const constructorArguments = [wallet.address];
  const contract = await deployContract(
    contractArtifactName,
    constructorArguments
  );

  // Supplying paymaster with ETH
  await (
    await wallet.sendTransaction({
      to: contract.target,
      value: ethers.parseEther("0.005"),
    })
  ).wait();

  let paymasterBalance = await provider.getBalance(contract.target.toString());
  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);
}
