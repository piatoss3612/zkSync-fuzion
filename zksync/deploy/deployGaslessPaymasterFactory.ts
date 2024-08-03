import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getWallet, getProvider, deployFactoryContract } from "./utils";
import { ethers } from "ethers";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();
  const provider = getProvider();

  const factoryName = "GaslessPaymasterFactory";
  const deps = ["GaslessPaymaster"];

  const factory = await deployFactoryContract(factoryName, [], deps);

  const tx = await factory.createPaymaster(
    "0x965B0E63e00E7805569ee3B428Cf96330DFc57EF",
    ethers.zeroPadBytes("0x", 20)
  );
  await tx.wait();
  //   const contractArtifactName = "GaslessPaymasterFactory";
  //   const constructorArguments = [];
  //   const contract = await deployContract(
  //     contractArtifactName,
  //     constructorArguments
  //   );

  //   // Supplying paymaster with ETH
  //   await (
  //     await wallet.sendTransaction({
  //       to: contract.target,
  //       value: ethers.parseEther("0.005"),
  //     })
  //   ).wait();

  //   let paymasterBalance = await provider.getBalance(contract.target.toString());
  //   console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);
}
