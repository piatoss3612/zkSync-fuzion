// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IFuzionPaymaster} from "../interfaces/IFuzionPaymaster.sol";
import {IModule, ModuleType, ModuleInitData} from "../interfaces/IModule.sol";
import {PaymasterBase} from "./PaymasterBase.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

abstract contract ModuleManager is IFuzionPaymaster, PaymasterBase, Initializable {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error ModuleAlreadyInstalled(address module);
    error InvalidModuleType(address module);
    error TooManyValidators();
    error DefaultModuleCannotBeDeleted(address module);

    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/
    uint256 private constant MAX_VALIDATORS = 10;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    mapping(address module => bool installed) private _installedModules;

    address[] private _defaultValidators;
    address private _defaultPayport;
    address private _defaultHook;

    function initialize(bytes calldata _initData) external override initializer {
        if (_initData.length == 0) {
            // No default modules to install
            return;
        }

        // Initialize the default modules
        ModuleInitData[] memory modules = abi.decode(_initData, (ModuleInitData[]));
        for (uint256 i = 0; i < modules.length; i++) {
            ModuleInitData memory module = modules[i];

            _installModule(module.module, module.initData);

            if (module.isDefault) {
                _setDefaultModuleWithoutValidation(module.moduleType, module.module);
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function _installModule(ModuleType moduleType, address _module, bytes memory _initData) internal {
        // Validate the module
        _validateOnModuleInstall(moduleType, _module);

        // Install the module
        _installModule(_module, _initData);

        emit ModuleInstalled(moduleType, _module);
    }

    function _setDefaultModule(ModuleType moduleType, address _module) internal {
        // Validate the module
        _validateOnModuleUninstallOrSetDefault(moduleType, _module);

        // Set the default module based on the module type
        _setDefaultModuleWithoutValidation(moduleType, _module);

        emit DefaultModuleSet(moduleType, _module);
    }

    function _setDefaultModules(address[] calldata _validators, address _payport, address _hook) internal {
        // Set the default validators
        _setDefaultValidators(_validators);

        // Set the default payport
        _validateOnModuleInstall(ModuleType.Payport, _payport);
        _setDefaultPayport(_payport);

        // Set the default hook
        _validateOnModuleInstall(ModuleType.Hook, _hook);
        _setDefaultHook(_hook);

        emit DefaultModulesSet(_validators, _payport, _hook);
    }

    function _installModuleAndSetDefault(ModuleType moduleType, address _module, bytes calldata _initData) internal {
        // Validate the module
        _validateOnModuleInstall(moduleType, _module);

        // Set the default module
        _setDefaultModuleWithoutValidation(moduleType, _module);

        emit DefaultModuleSet(moduleType, _module);

        // Install the module
        // it goes after setting the default module, cause we call the external function to install with the module
        _installModule(_module, _initData);

        emit ModuleInstalled(moduleType, _module);
    }

    function _uninstallModule(ModuleType moduleType, address _module, bool _forceDelete, bytes calldata _deletionData)
        internal
    {
        // Validate the module
        _validateOnModuleUninstallOrSetDefault(moduleType, _module);

        // Remove the module from the installed modules
        _installedModules[_module] = false;

        // Check if the module is set as default
        if (moduleType == ModuleType.Validator) {
            uint256 vLen = _defaultValidators.length;
            for (uint256 i = 0; i < vLen; i++) {
                if (_module == _defaultValidators[i]) {
                    // Remove the module from the default validators based on the force delete flag
                    if (_forceDelete) {
                        // order does matter, so we need to shift the elements
                        for (uint256 j = i; j < vLen - 1; j++) {
                            _defaultValidators[j] = _defaultValidators[j + 1];
                        }
                        _defaultValidators.pop(); // remove the last element
                    } else {
                        revert DefaultModuleCannotBeDeleted(_module);
                    }
                }
            }
        } else if (moduleType == ModuleType.Payport) {
            if (_module == _defaultPayport) {
                if (_forceDelete) {
                    _defaultPayport = address(0);
                } else {
                    revert DefaultModuleCannotBeDeleted(_module);
                }
            }
        } else if (moduleType == ModuleType.Hook) {
            if (_module == _defaultHook) {
                if (_forceDelete) {
                    _defaultHook = address(0);
                } else {
                    revert DefaultModuleCannotBeDeleted(_module);
                }
            }
        }

        // Uninstall the module
        IModule(_module).onUninstall(_deletionData);

        emit ModuleUninstalled(moduleType, _module);
    }

    /*//////////////////////////////////////////////////////////////
                            PRIVATE FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function _validateOnModuleInstall(ModuleType moduleType, address _module) private view {
        // Module should not be installed
        if (_checkModuleInstalled(_module)) {
            revert ModuleAlreadyInstalled(_module);
        }

        // Module should be of the correct type
        if (!_validateModuleType(moduleType, _module)) {
            revert InvalidModuleType(_module);
        }
    }

    function _validateOnModuleUninstallOrSetDefault(ModuleType moduleType, address _module) private view {
        // Module should be installed
        if (!_checkModuleInstalled(_module)) {
            revert ModuleAlreadyInstalled(_module);
        }

        // Module should be of the correct type
        if (!_validateModuleType(moduleType, _module)) {
            revert InvalidModuleType(_module);
        }
    }

    function _installModule(address _module, bytes memory _initData) private {
        _installedModules[_module] = true;
        IModule(_module).onInstall(_initData);
    }

    function _setDefaultModuleWithoutValidation(ModuleType moduleType, address _module) private {
        if (moduleType == ModuleType.Validator) {
            _setDefaultValidator(_module);
        } else if (moduleType == ModuleType.Payport) {
            _setDefaultPayport(_module);
        } else if (moduleType == ModuleType.Hook) {
            _setDefaultHook(_module);
        }
    }

    function _setDefaultValidator(address _module) private {
        // Check if the default validators are not full
        if (_defaultValidators.length >= MAX_VALIDATORS) {
            revert TooManyValidators();
        }

        _defaultValidators.push(_module);
    }

    function _setDefaultValidators(address[] calldata _validators) private {
        // Set the default validators
        uint256 vLen = _validators.length;

        if (vLen > MAX_VALIDATORS) {
            revert TooManyValidators();
        }

        for (uint256 i = 0; i < vLen; i++) {
            // Check if the module is not installed
            _validateOnModuleUninstallOrSetDefault(ModuleType.Validator, _validators[i]);
        }

        _defaultValidators = _validators;
    }

    function _setDefaultPayport(address _module) private {
        _defaultPayport = _module;
    }

    function _setDefaultHook(address _module) private {
        _defaultHook = _module;
    }

    function _checkModuleInstalled(address _module) private view returns (bool installed) {
        installed = _installedModules[_module];
    }

    function _validateModuleType(ModuleType moduleType, address _module) private view returns (bool valid) {
        valid = IModule(_module).isModuleType(moduleType);
    }

    /*//////////////////////////////////////////////////////////////
                                GETTERS
    //////////////////////////////////////////////////////////////*/
    function isInstalledModule(ModuleType moduleType, address _module) public view returns (bool) {
        return _checkModuleInstalled(_module) && _validateModuleType(moduleType, _module);
    }

    function defaultValidators() public view returns (address[] memory) {
        return _defaultValidators;
    }

    function defaultValidator(uint256 index) public view returns (address) {
        return _defaultValidators[index];
    }

    function defaultPayport() public view returns (address) {
        return _defaultPayport;
    }

    function defaultHook() public view returns (address) {
        return _defaultHook;
    }
}
