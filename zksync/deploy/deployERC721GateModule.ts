import { deployContract } from "./utils";

export default async function () {
  const contractArtifactName = "ERC721Gate";
  const constructorArguments = [];
  await deployContract(contractArtifactName, constructorArguments);
}
