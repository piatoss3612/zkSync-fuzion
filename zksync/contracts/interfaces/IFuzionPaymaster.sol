// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymaster} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IModule, ModuleType} from "./IModule.sol";

interface IFuzionPaymaster is IPaymaster, IERC165 {
    error ValidationFailed(string reason);
    error InvalidPaymasterInput();
    error UnsupportedPaymasterFlow();

    event ModuleInstalled(ModuleType moduleType, address module);
    event ModuleUninstalled(ModuleType moduleType, address module);
    event DefaultModuleSet(ModuleType moduleType, address module);
    event DefaultModulesSet(address[] validators, address payport, address hook);
    event FeeToSet(address feeTo);

    function installModule(ModuleType moduleType, address _module, bytes calldata _initData) external payable;
    function installModuleAndSetDefault(ModuleType moduleType, address _module, bytes calldata _initData)
        external
        payable;
    function setDefaultModule(ModuleType moduleType, address _module) external;
    function setDefaultModules(address[] calldata _validators, address _payport, address _hook) external;
    function uninstallModule(ModuleType moduleType, address _module, bool _forceDelete, bytes calldata _deletionData)
        external;
    function isInstalledModule(ModuleType moduleType, address _module) external view returns (bool);
    function setFeeTo(address _feeTo) external;
    function defaultValidators() external view returns (address[] memory);
    function defaultValidator(uint256 index) external view returns (address);
    function defaultPayport() external view returns (address);
    function defaultHook() external view returns (address);
    function feeTo() external view returns (address);
}
