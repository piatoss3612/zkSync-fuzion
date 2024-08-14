import { deployContract, getWallet } from "./utils";

export default async function () {
  const wallet = getWallet();
  const paymasterFactoryAddress = "0x111A479Ac2bA70026dc6783cfB5321076Af9076F";

  const contractArtifactName = "FuzionRouter";
  const constructorArguments = [paymasterFactoryAddress, wallet.address];
  await deployContract(contractArtifactName, constructorArguments);
}
