// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IModule, ModuleType} from "./IModule.sol";

/// @title Fuzion Router Interface
/// @author piatoss3612
/// @dev Interface for the Fuzion Router contract
interface IFuzionRouter {
    error FuzionRouter__ZeroAddress();
    error FuzionRouter__PaymasterFactoryNotAvailable();
    error FuzionRouter__ModuleAlreadyRegistered();
    error FuzionRouter__NotExpectedPaymaster();

    event PaymasterCreated(address indexed paymaster, address indexed owner, string name);
    event ModuleRegistered(address indexed module, ModuleType moduleType, string name);

    /// @dev Returns the factory address
    /// @return The factory address
    function factory() external view returns (address);
    /// @dev Creates a paymaster with the given parameters
    /// @param _salt The salt for the paymaster (create2 address)
    /// @param _owner The owner of the paymaster
    /// @param _feeTo The fee to address of the paymaster
    /// @param _alias The alias name of the paymaster (to index the paymaster with the subgraph)
    /// @param _initData The initialization data for the paymaster
    function createPaymaster(
        bytes32 _salt,
        address _owner,
        address _feeTo,
        string calldata _alias,
        bytes calldata _initData
    ) external payable;
    /// @dev Registers a module with the given address (only one time registration)
    /// @param _module The address of the module to register
    function registerModule(address _module) external;

    // TODO: rating system for community modules
}
