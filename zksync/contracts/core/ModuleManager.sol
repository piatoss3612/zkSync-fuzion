// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IFuzionPaymaster} from "../interfaces/IFuzionPaymaster.sol";
import {IModule, ModuleType} from "../interfaces/IModule.sol";
import {PaymasterBase} from "./PaymasterBase.sol";

abstract contract ModuleManager is IFuzionPaymaster, PaymasterBase {
    function _installModule(ModuleType moduleType, address _module, bytes calldata _initData) internal {}
    function _installModuleAndSetDefault(ModuleType moduleType, address _module, bytes calldata _initData) internal {}
    function _setDefaultModule(ModuleType moduleType, address _module) internal {}
    function _uninstallModule(ModuleType moduleType, address _module, bool _forceDelete) internal {}
    function isInstalledModule(ModuleType moduleType, address _module) external view returns (bool) {}
    function defaultValidators() external view returns (address[] memory) {}
    function defaultValidator(uint256 index) external view returns (address) {}
    function defaultPayport() external view returns (address) {}
    function defaultValidatorHook() external view returns (address) {}
    function defaultPaymentHook() external view returns (address) {}
    function defaultRefundHook() external view returns (address) {}
}
