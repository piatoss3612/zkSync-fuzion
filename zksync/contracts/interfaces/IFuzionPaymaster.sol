// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymaster} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IModule, ModuleType} from "./IModule.sol";

interface IFuzionPaymaster is IPaymaster, IERC165 {
    event ModuleInstalled(ModuleType moduleType, address module);
    event ModuleUninstalled(ModuleType moduleType, address module);

    function installModule(ModuleType moduleType, address _module, bytes calldata _initData) external payable;
    function installModuleAndSetDefault(ModuleType moduleType, address _module, bytes calldata _initData)
        external
        payable;
    function setDefaultModule(ModuleType moduleType, address _module) external;
    function uninstallModule(ModuleType moduleType, address _module, bool _forceDelete) external;
    function isInstalledModule(ModuleType moduleType, address _module) external view returns (bool);
    function defaultValidators() external view returns (address[] memory);
    function defaultValidator(uint256 index) external view returns (address);
    function defaultPayport() external view returns (address);
    function defaultValidatorHook() external view returns (address);
    function defaultPaymentHook() external view returns (address);
    function defaultRefundHook() external view returns (address);
}
