// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IModule, ModuleType} from "./IModule.sol";

interface IFuzionRouter {
    error FuzionRouter__ZeroAddress();
    error FuzionRouter__PaymasterFactoryNotAvailable();
    error FuzionRouter__ModuleAlreadyRegistered();

    event PaymasterCreated(address indexed paymaster, address indexed owner, string name);
    event ModuleRegistered(address indexed module, ModuleType moduleType, string name);

    function factory() external view returns (address);
    // TODO: createPaymaster needs other form of input to initialize the paymaster with modules
    function createPaymaster(address _owner, string calldata _alias, bytes calldata _initData) external payable;
    function registerModule(address _module) external;
}
