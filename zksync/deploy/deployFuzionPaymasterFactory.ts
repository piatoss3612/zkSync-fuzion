import { verifyContract } from "./utils";
import { AbiCoder } from "ethers";
import { getWallet } from "./utils";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { hashBytecode } from "zksync-ethers/build/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);

  const factoryArtifact = await deployer.loadArtifact("FuzionPaymasterFactory");
  const paymasterArtifact = await deployer.loadArtifact("FuzionPaymaster");

  const paymasterBytecodeHash = hashBytecode(paymasterArtifact.bytecode);

  const factory = await deployer.deploy(
    factoryArtifact,
    [paymasterBytecodeHash],
    undefined,
    undefined,
    [paymasterArtifact.bytecode]
  );

  const factoryAddress = await factory.getAddress();

  console.log("Factory deployed at", factoryAddress);

  const abiCoder = new AbiCoder();

  console.log("Verifying factory contract on Block Explorer...");

  await verifyContract({
    address: factoryAddress,
    contract: "contracts/FuzionPaymasterFactory.sol:FuzionPaymasterFactory",
    constructorArguments: abiCoder.encode(["bytes32"], [paymasterBytecodeHash]),
    bytecode: factoryArtifact.bytecode,
  });

  console.log("Successfully verified factory contract!");
}
