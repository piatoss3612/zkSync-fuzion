// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IModule, ModuleType} from "./IModule.sol";

interface IFuzionRouter {
    error FuzionRouter__ZeroAddress();
    error FuzionRouter__PaymasterFactoryNotAvailable();
    error FuzionRouter__ModuleAlreadyRegistered();
    error FuzionRouter__NotExpectedPaymaster();

    event PaymasterCreated(address indexed paymaster, address indexed owner, string name);
    event ModuleRegistered(address indexed module, ModuleType moduleType, string name);

    function factory() external view returns (address);
    function createPaymaster(
        bytes32 _salt,
        address _owner,
        address _feeTo,
        string calldata _alias,
        bytes calldata _initData
    ) external payable;
    function registerModule(address _module) external;
}
