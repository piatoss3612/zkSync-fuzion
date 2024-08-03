import { deployFactoryContract } from "./utils";
import { ethers } from "ethers";

export default async function () {
  const factoryName = "GaslessPaymasterFactory";
  const deps = ["GaslessPaymaster"];

  await deployFactoryContract(factoryName, [], deps);
}
