// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymaster} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IModule, ModuleType} from "./IModule.sol";

/// @title Fuzion Paymaster Interface
/// @author piatoss3612
/// @dev Interface for the Fuzion Paymaster contract
interface IFuzionPaymaster is IPaymaster, IERC165 {
    error ValidationFailed(string reason);
    error InvalidPaymasterInput();
    error UnsupportedPaymasterFlow();

    event ModuleInstalled(ModuleType moduleType, address module);
    event ModuleUninstalled(ModuleType moduleType, address module);
    event DefaultModuleSet(ModuleType moduleType, address module);
    event DefaultModulesSet(address[] validators, address payport, address hook);
    event FeeToSet(address feeTo);

    /// @dev Initializes the paymaster with the given initialization data
    ///      (zero-length data is allowed when no module is needed at initialization)
    /// @param _initData The initialization data for the paymaster
    function initialize(bytes calldata _initData) external;
    /// @dev Installs a module of the given type with the given address and initialization data
    /// @param moduleType The type of the module to install
    /// @param _module The address of the module to install
    /// @param _initData The initialization data for the module
    function installModule(ModuleType moduleType, address _module, bytes calldata _initData) external payable;
    /// @dev Installs a module of the given address and sets it as the default module of the given type
    /// @param moduleType The type of the module to install and set as default
    /// @param _module The address of the module to install and set as default
    /// @param _initData The initialization data for the module
    function installModuleAndSetDefault(ModuleType moduleType, address _module, bytes calldata _initData)
        external
        payable;
    /// @dev Sets the default module of the given type to the given address
    ///      (the module must be installed before setting it as default)
    /// @param moduleType The type of the module to set as default
    /// @param _module The address of the module to set as default
    function setDefaultModule(ModuleType moduleType, address _module) external;
    /// @dev Sets the default modules for the paymaster
    /// @param _validators The addresses of the default validator modules
    /// @param _payport The address of the default payport module
    /// @param _hook The address of the default hook module
    function setDefaultModules(address[] calldata _validators, address _payport, address _hook) external;
    /// @dev Uninstalls a module of the given type with the given address
    ///      (the module must be uninstalled before deleting it)
    /// @param moduleType The type of the module to uninstall
    /// @param _module The address of the module to uninstall
    /// @param _forceDelete Whether to force delete if the module is set as default module
    /// @param _deletionData The deletion data for the module
    function uninstallModule(ModuleType moduleType, address _module, bool _forceDelete, bytes calldata _deletionData)
        external;
    /// @dev Sets the feeTo address for the paymaster
    /// @param _feeTo The address to set as feeTo
    function setFeeTo(address _feeTo) external;
    /// @dev Checks whether the given module is installed for the given type
    /// @param moduleType The type of the module to check
    /// @param _module The address of the module to check
    /// @return Whether the module is installed
    function isInstalledModule(ModuleType moduleType, address _module) external view returns (bool);
    /// @dev Gets the default validator modules for the paymaster
    /// @return The addresses of the default validator modules (multiple validators are allowed)
    function defaultValidators() external view returns (address[] memory);
    /// @dev Gets the default validator module for the paymaster at the given index
    /// @param index The index of the default validator module to get
    /// @return The address of the default validator module at the given index
    function defaultValidator(uint256 index) external view returns (address);
    /// @dev Gets the default payport module for the paymaster
    /// @return The address of the default payport module
    function defaultPayport() external view returns (address);
    /// @dev Gets the default hook module for the paymaster
    /// @return The address of the default hook module
    function defaultHook() external view returns (address);
    /// @dev Gets the feeTo address for the paymaster
    /// @return The address set as feeTo
    function feeTo() external view returns (address);
}
