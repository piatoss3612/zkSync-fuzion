import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployFactoryContract } from "./utils";
import { ethers } from "ethers";

export default async function (hre: HardhatRuntimeEnvironment) {
  const factoryName = "GaslessPaymasterFactory";
  const deps = ["GaslessPaymaster"];

  const factory = await deployFactoryContract(factoryName, [], deps);

  const tx = await factory.createPaymaster(
    "0x965B0E63e00E7805569ee3B428Cf96330DFc57EF",
    ethers.zeroPadBytes("0x", 20)
  );
  await tx.wait();
}
