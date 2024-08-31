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
    error FuzionRouter__ModuleNotRegistered(address addr);
    error FuzionRouter__ModuleAlreadyRated(address module, address rater);

    enum Rating {
        F,
        D,
        C,
        B,
        A,
        S
    }

    struct RatingData {
        uint128 accumulativeRating; // accumulative rating of the module
        uint128 accumulativeRatingCount; // count of the rating
    }

    event PaymasterCreated(address indexed paymaster, address indexed owner, string name);
    event ModuleRegistered(address indexed module, ModuleType moduleType, string name);
    event ModuleRatingUpdated(
        address indexed module, address indexed rater, Rating rating, uint256 totalRating, uint256 totalCount
    );

    // ============ Paymaster Factory ============

    /// @dev Returns the factory address
    /// @return The factory address
    function factory() external view returns (address);
    /// @dev Calculates the paymaster address with the given parameters
    /// @param _salt The salt for the paymaster (create2 address)
    /// @param _owner The owner of the paymaster
    /// @param _feeTo The fee to address of the paymaster
    function calculatePaymasterAddress(bytes32 _salt, address _owner, address _feeTo) external view returns (address);
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

    // ============ Module Registration ============

    /// @dev Registers a module with the given address (only one time registration)
    /// @param _module The address of the module to register
    function registerModule(address _module) external;

    /// @dev Returns whether the module is registered
    /// @param _module The address of the module
    function isModuleRegistered(address _module) external view returns (bool);

    // ============ Module Rating ============

    /// @dev Updates the rating of the module
    /// @param _module The address of the module
    /// @param _rating The rating of the module
    function rateModule(address _module, Rating _rating) external;
    /// @dev Returns the module rating data
    /// @param _module The address of the module
    /// @return ratingData The rating data of the module
    function getModuleRatingData(address _module) external view returns (RatingData memory ratingData);
    /// @dev Returns whether the module has been rated by the rater
    /// @param _rater The address of the rater
    /// @param _module The address of the module
    /// @return Whether the module has been rated by the rater
    function hasRatedModule(address _rater, address _module) external view returns (bool);
}
