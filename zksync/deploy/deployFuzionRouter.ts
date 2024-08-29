import { deployContract, getWallet } from "./utils";

export default async function () {
  const wallet = getWallet();
  const paymasterFactoryAddress = "0x82e7Fc2D13ee7515f182D445974e0788A181d7AC";

  const contractArtifactName = "FuzionRouter";
  const constructorArguments = [paymasterFactoryAddress, wallet.address];
  await deployContract(contractArtifactName, constructorArguments);
}
