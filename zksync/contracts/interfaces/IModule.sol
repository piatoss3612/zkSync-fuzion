// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ExecutionResult} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

enum ModuleType {
    Validator,
    Payment,
    Hook
}

struct ModuleMetadata {
    ModuleType moduleType;
    string name;
    string version;
    string author;
    string installDataSignature;
}

interface IModule is IERC165 {
    function onInstall(bytes calldata data) external;
    function onUpdate(bytes calldata data) external;
    function onUninstall(bytes calldata data) external;
    function metadata() external view returns (ModuleMetadata memory);
}

interface IValidator is IModule {
    function validateTransaction(bytes32 _txHash, bytes32 _suggestedSignedHash, Transaction calldata _transaction)
        external
        view
        returns (bytes4 magic);
}

struct PaymentData {
    bytes4 paymasterInputSelector;
    address asset;
    uint256 amount;
}

address constant ETHER_ADDRESS = 0x000000000000000000000000000000000000800A;

interface IPayment is IModule {
    function prepareForPayment(Transaction calldata _transaction)
        external
        returns (PaymentData memory paymentData, bytes memory context);
    function prepareForRefund(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external returns (PaymentData memory paymentData);
}

interface IValidationHook is IModule {
    function beforeValidateTransaction(bytes32 _txHash, bytes32 _suggestedSignedHash, Transaction calldata _transaction)
        external
        returns (uint256);
}

interface IPaymentHook is IModule {
    function beforePrepareForPayment(Transaction calldata _transaction) external returns (uint256);
    function afterPayment(Transaction calldata _transaction, PaymentData calldata _paymentData) external;
    function beforePrepareForRefund(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external returns (uint256);
}
