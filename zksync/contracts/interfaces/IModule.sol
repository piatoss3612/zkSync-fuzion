// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ExecutionResult} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

enum ModuleType {
    Validator,
    Payport,
    Hook
}

struct ModuleMetadata {
    ModuleType moduleType; // Type of the module.
    string name; // Name of the module.
    string version; // Version of the module.
    string author; // Author of the module.
    string installDataSignature; // Signature of the install data. (I think it would be better to use (type, name) array instead of just a string)
}

interface IModule is IERC165 {
    function onInstall(bytes calldata data) external;
    function onUninstall(bytes calldata data) external;
    function metadata() external view returns (ModuleMetadata memory);
    function isModuleType(ModuleType _moduleType) external view returns (bool);
    function isInstalled(address _account) external view returns (bool);
}

struct ModuleInitData {
    ModuleType moduleType;
    bool isDefault;
    address module;
    bytes initData;
}

interface IValidator is IModule {
    function validateTransaction(bytes32 _txHash, bytes32 _suggestedSignedHash, Transaction calldata _transaction)
        external
        view
        returns (bool isValid);
}

struct PreparePaymentData {
    bytes4 paymasterInputSelector; // Selector of the IPaymasterFlow method (for double check just in case).
    address from; // Address to transfer from.
    address token; // Not zero if token transfer is required.
    uint96 requiredETH; // Required amount of ETH to transfer to the Bootloader. (fee might not greater than 1 ETH, so uint96 is enough)
    uint256 requiredToken; // Required amount of token.
    bytes extraData; // Reserved for future use.
}

struct PrepareRefundData {
    address token; // Not zero if token transfer is required.
    address to; // Address to transfer refund to.
    uint96 fee; // Fee to charge from the refund (to cover the gas cost paymaster spent for additional checks).
    uint256 amount; // Amount of token to refund excluding fee.
}

interface IPayport is IModule {
    function preparePayment(Transaction calldata _transaction)
        external
        returns (PreparePaymentData memory paymentData);
    function prepareRefund(
        Transaction calldata _transaction,
        PreparePaymentData calldata _paymentData,
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external returns (PrepareRefundData memory refundData);
}

interface IHook is IModule {
    function preCheck(bytes32 _txHash, bytes32 _suggestedSignedHash, Transaction calldata _transaction)
        external
        returns (bytes memory hookContext);

    function postCheck(bytes calldata hookContext) external;
}
