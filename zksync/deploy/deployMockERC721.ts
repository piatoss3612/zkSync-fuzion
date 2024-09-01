import { deployContract, getWallet } from "./utils";

export default async function () {
  const contractArtifactName = "MockERC721";
  const constructorArguments = [];
  await deployContract(contractArtifactName, constructorArguments);
}
