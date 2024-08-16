import { deployContract, getWallet } from "./utils";

export default async function () {
  const wallet = getWallet();
  const paymasterFactoryAddress = "0xA6eb2386aecb4673bc039cf89F21f77c4CcB10c7";

  const contractArtifactName = "FuzionRouter";
  const constructorArguments = [paymasterFactoryAddress, wallet.address];
  await deployContract(contractArtifactName, constructorArguments);
}
