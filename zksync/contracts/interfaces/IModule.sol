// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ExecutionResult} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/// @title Module Type Enum
/// @dev Validator, Payport, Hook module types
///      Validator: Validates the transaction
///      Payport: Prepares the payment and refund data
///      Hook: Pre-checks and post-checks the transaction
enum ModuleType {
    Validator,
    Payport,
    Hook
}

/// @title Module Metadata Struct
/// @dev Metadata of the module
///      moduleType: Type of the module
///      name: Name of the module
///      version: Version of the module
///      author: Author of the module
///      installDataSignature: Signature of the install data, ex) "onInstall(address)"
struct ModuleMetadata {
    ModuleType moduleType;
    string name;
    string version;
    string author;
    string installDataSignature;
}

/// @title Module Interface
/// @dev Interface for the module used in the Fuzion Paymaster
interface IModule is IERC165 {
    /// @dev Initializes the module with the given initialization data, called by the paymaster
    /// @param data The initialization data for the module
    function onInstall(bytes calldata data) external payable;
    /// @dev Uninstalls the module with the given data, called by the paymaster
    /// @param data The uninstallation data for the module
    function onUninstall(bytes calldata data) external;
    /// @dev Returns the metadata of the module
    /// @return Metadata of the module
    function metadata() external view returns (ModuleMetadata memory);
    /// @dev Checks whether the module is of the given type
    /// @param _moduleType The type of the module to check
    function isModuleType(ModuleType _moduleType) external view returns (bool);
    /// @dev Checks whether the module is installed for the given account, mapped by the account address
    /// @param _account The account to check
    function isInstalled(address _account) external view returns (bool);
}

/// @title Module Init Data Struct
/// @dev Initialization data for the module used in the Fuzion Paymaster `initialize` function
///      moduleType: Type of the module
///      isDefault: Whether the module is default
///      module: Address of the module
///      initData: Initialization data for the module
struct ModuleInitData {
    ModuleType moduleType;
    bool isDefault;
    address module;
    bytes initData;
}

/// @title Validator Module Interface
/// @dev Interface for the validator module used in the Fuzion Paymaster
interface IValidator is IModule {
    /// @dev Validates the transaction with the given transaction hash, suggested signed hash, and transaction
    /// @param _txHash The hash of the transaction
    /// @param _suggestedSignedHash The hash of the transaction that is signed by an EOA
    /// @param _transaction The transaction itself.
    /// @return isValid Whether the transaction is valid
    function validateTransaction(bytes32 _txHash, bytes32 _suggestedSignedHash, Transaction calldata _transaction)
        external
        view
        returns (bool isValid);
}

/// @title Prepare Payment Data Struct for Payport Module
/// @dev Contains the data for payment preparation in the Payport module
///      paymasterInputSelector: Selector of the IPaymasterFlow method (for double check just in case)
///      from: Address to transfer from
///      token: Not zero if token transfer is required
///      requiredETH: Required amount of ETH to transfer to the Bootloader
///      requiredToken: Required amount of token
///      extraData: Reserved for future use
struct PreparePaymentData {
    bytes4 paymasterInputSelector;
    address from;
    address token;
    uint96 requiredETH;
    uint256 requiredToken;
    bytes extraData;
}

/// @title Prepare Refund Data Struct for Payport Module
/// @dev Contains the data for refund preparation in the Payport module
///      token: Not zero if token transfer is required
///      to: Address to transfer refund to
///      fee: Fee to charge from the refund (to cover the gas cost paymaster spent for additional checks)
///      amount: Amount of token to refund excluding fee
struct PrepareRefundData {
    address token;
    address to;
    uint96 fee;
    uint256 amount;
}

/// @title Payport Module Interface
/// @dev Interface for the payport module used in the Fuzion Paymaster
interface IPayport is IModule {
    /// @dev Prepares the payment data for the transaction
    ///      as the module is called externally, payment is not executed in this function
    ///      only the data is prepared for the payment and actual payment is executed by the paymaster
    /// @param _transaction The transaction to prepare the payment data for
    /// @return paymentData The payment data for the transaction
    function preparePayment(Transaction calldata _transaction)
        external
        returns (PreparePaymentData memory paymentData);
    /// @dev Prepares the refund data for the transaction
    ///      as the module is called externally, refund is not executed in this function
    ///      only the data is prepared for the refund and actual refund is executed by the paymaster
    /// @param _transaction The transaction to prepare the refund data for
    /// @param _paymentData The payment data for the transaction
    /// @param _txHash The hash of the transaction
    /// @param _suggestedSignedHash The hash of the transaction that is signed by an EOA
    /// @param _txResult The result of the transaction execution
    /// @param _maxRefundedGas The maximum gas to refund
    /// @return refundData The refund data for the transaction
    function prepareRefund(
        Transaction calldata _transaction,
        PreparePaymentData calldata _paymentData,
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external returns (PrepareRefundData memory refundData);
}

/// @title Hook Module Interface
/// @dev Interface for the hook module used in the Fuzion Paymaster
///      Hook module is used for pre-checks and post-checks of the transaction
interface IHook is IModule {
    /// @dev Pre-checks the transaction with the given transaction hash, suggested signed hash, and transaction
    /// @param _txHash The hash of the transaction
    /// @param _suggestedSignedHash The hash of the transaction that is signed by an EOA
    /// @param _transaction The transaction itself.
    /// @return hookContext The context for the hook
    function preCheck(bytes32 _txHash, bytes32 _suggestedSignedHash, Transaction calldata _transaction)
        external
        returns (bytes memory hookContext);
    /// @dev Post-checks the transaction with the given hook context
    /// @param hookContext The context for the hook
    function postCheck(bytes calldata hookContext) external;
}
