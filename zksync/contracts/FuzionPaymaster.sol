// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ZKSync
import {
    IPaymaster,
    ExecutionResult,
    PAYMASTER_VALIDATION_SUCCESS_MAGIC
} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
import {
    TransactionHelper,
    Transaction
} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

// Fuzion
import {IFuzionPaymaster} from "./interfaces/IFuzionPaymaster.sol";
import {ModuleType} from "./interfaces/IModule.sol";
import {ModuleManager} from "./core/ModuleManager.sol";

// OpenZeppelin
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FuzionPaymaster is ModuleManager, Ownable {
    address private _feeTo;

    constructor(address _owner, address _feeToAddress) payable Ownable(_owner) {
        _feeTo = _feeToAddress;
    }

    function validateAndPayForPaymasterTransaction(bytes32, bytes32, Transaction calldata _transaction)
        external
        payable
        onlyBootloader
        returns (bytes4 magic, bytes memory context)
    {
        // By default we consider the transaction as accepted.
        magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;
        // if (_transaction.paymasterInput.length < 4) {
        //     revert FuzionPaymaster__InvalidPaymasterInput();
        // }

        // bytes4 paymasterInputSelector = bytes4(_transaction.paymasterInput[0:4]);
        // if (paymasterInputSelector != IPaymasterFlow.general.selector) {
        //     revert FuzionPaymaster__UnsupportedPaymasterFlow();
        // }

        // Note, that while the minimal amount of ETH needed is tx.gasPrice * tx.gasLimit,
        // neither paymaster nor account are allowed to access this context variable.
        uint256 requiredETH = _transaction.gasLimit * _transaction.maxFeePerGas;

        // The bootloader never returns any data, so it can safely be ignored here.
        _payForPaymasterTransaction(requiredETH);
    }

    function postTransaction(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable override onlyBootloader {}

    function installModule(ModuleType moduleType, address _module, bytes calldata _initData)
        external
        payable
        onlyOwner
    {
        _installModule(moduleType, _module, _initData);
    }

    function installModuleAndSetDefault(ModuleType moduleType, address _module, bytes calldata _initData)
        external
        payable
        onlyOwner
    {
        _installModuleAndSetDefault(moduleType, _module, _initData);
    }

    function setDefaultModule(ModuleType moduleType, address _module) external onlyOwner {
        _setDefaultModule(moduleType, _module);
    }

    function setDefaultModules(address[] calldata _validators, address _payport, address _hook) external onlyOwner {
        _setDefaultModules(_validators, _payport, _hook);
    }

    function uninstallModule(ModuleType moduleType, address _module, bool _forceDelete, bytes calldata _deletionData)
        external
        onlyOwner
    {
        _uninstallModule(moduleType, _module, _forceDelete, _deletionData);
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return interfaceId == type(IFuzionPaymaster).interfaceId || interfaceId == type(IPaymaster).interfaceId
            || interfaceId == type(IERC165).interfaceId;
    }

    function withdraw(address payable _to, uint256 _amount) external onlyOwner {
        _withdraw(_to, _amount);
    }

    function withdraw(address _token, address payable _to, uint256 _amount) external onlyOwner {
        _withdraw(_token, _to, _amount);
    }

    function setFeeTo(address _feeToAddress) external onlyOwner {
        _feeTo = _feeToAddress;
        emit FeeToSet(_feeToAddress);
    }

    function feeTo() external view returns (address) {
        return _feeTo;
    }
}
