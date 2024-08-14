// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymaster} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";

contract FuzionPaymasterFactory {
    error DeploymentFailed();

    event PaymasterCreated(address paymaster, address owner);

    bytes32 private _bytecodeHash;

    function createPaymaster(bytes32 _salt, address _owner, address _feeTo)
        external
        payable
        returns (address paymaster)
    {
        // Call the system contract to deploy the account
        (bool success, bytes memory returnData) = SystemContractsCaller.systemCallWithReturndata(
            uint32(gasleft()),
            address(DEPLOYER_SYSTEM_CONTRACT),
            uint128(msg.value),
            abi.encodeCall(DEPLOYER_SYSTEM_CONTRACT.create2, (_salt, _bytecodeHash, abi.encode(_owner, _feeTo)))
        );
        if (!success) {
            revert DeploymentFailed();
        }

        // Decode the return data to get the address of the deployed account
        (paymaster) = abi.decode(returnData, (address));
    }

    function getPaymasterAddress(bytes32 _salt, address _owner, address _feeTo)
        external
        view
        returns (address paymaster)
    {
        paymaster = IContractDeployer(DEPLOYER_SYSTEM_CONTRACT).getNewAddressCreate2(
            address(this), _bytecodeHash, _salt, abi.encode(_owner, _feeTo)
        );
    }
}
