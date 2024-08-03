import { deployContract, getWallet } from "./utils";

export default async function () {
  const wallet = getWallet();

  const contractArtifactName = "FuzionRouter";
  const constructorArguments = [wallet.address];
  const contract = await deployContract(
    contractArtifactName,
    constructorArguments
  );

  const tx = await contract.setPaymasterFactory(
    "0x1cBa868B876cB00140a43895246559b2e5E129c9"
  );
  await tx.wait();
}
