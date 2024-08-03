// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymaster} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";

interface IPaymasterFactory {
    event PaymasterCreated(address indexed paymaster, address indexed owner);

    function name() external pure returns (string memory);
    function description() external pure returns (string memory);
    function createPaymaster(address _owner, bytes calldata _initData) external payable returns (IPaymaster);
}
