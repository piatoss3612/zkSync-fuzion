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
import {ModuleType, PreparePaymentData, PrepareRefundData} from "./interfaces/IModule.sol";
import {ModuleManager} from "./core/ModuleManager.sol";
import {FeeManager} from "./core/FeeManager.sol";

// OpenZeppelin
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FuzionPaymaster is ModuleManager, FeeManager, Ownable {
    constructor(address _owner, address _feeToAddress) payable FeeManager(_feeToAddress) Ownable(_owner) {}

    /*//////////////////////////////////////////////////////////////
                             FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function validateAndPayForPaymasterTransaction(
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) external payable onlyBootloader returns (bytes4 magic, bytes memory context) {
        // Validate the transaction.
        string memory reason;
        (magic, reason) = _validateTransaction(_txHash, _suggestedSignedHash, _transaction);
        if (magic != PAYMASTER_VALIDATION_SUCCESS_MAGIC) {
            revert ValidationFailed(reason);
        }

        // Prepare payment for the paymaster.
        PreparePaymentData memory paymentData = _preparePayment(_transaction);

        // The bootloader never returns any data, so it can safely be ignored here.
        context = _payForPaymasterTransaction(paymentData);
    }

    function postTransaction(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable override onlyBootloader {
        // Prepare refund for the paymaster.
        PrepareRefundData memory refundData =
            _prepareRefund(_context, _transaction, _txHash, _suggestedSignedHash, _txResult, _maxRefundedGas);

        // Refund the excess charged amount to the user.
        _refund(refundData);
    }

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

    function withdraw(address payable _to, uint256 _amount) external onlyOwner {
        _withdraw(_to, _amount);
    }

    function withdraw(address _token, address payable _to, uint256 _amount) external onlyOwner {
        _withdraw(_token, _to, _amount);
    }

    function setFeeTo(address _feeToAddress) external onlyOwner {
        _setFeeTo(_feeToAddress);
    }

    /*//////////////////////////////////////////////////////////////
                                IERC165
    //////////////////////////////////////////////////////////////*/
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return interfaceId == type(IFuzionPaymaster).interfaceId || interfaceId == type(IPaymaster).interfaceId
            || interfaceId == type(IERC165).interfaceId;
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function _validateTransaction(bytes32 _txHash, bytes32 _suggestedSignedHash, Transaction calldata _transaction)
        internal
        view
        returns (bytes4 magic, string memory reason)
    {
        // TODO: Implement the logic to validate the transaction.
        return (PAYMASTER_VALIDATION_SUCCESS_MAGIC, "");
    }

    function _preparePayment(Transaction calldata _transaction)
        internal
        view
        returns (PreparePaymentData memory paymentData)
    {
        // TODO: Implement the logic to prepare payment for the paymaster.
        return PreparePaymentData({
            paymasterInputSelector: IPaymasterFlow.general.selector,
            from: address(this),
            token: address(0),
            requiredETH: _transaction.gasLimit * _transaction.maxFeePerGas,
            requiredToken: 0,
            extraData: ""
        });
    }

    function _payForPaymasterTransaction(PreparePaymentData memory _paymentData)
        internal
        returns (bytes memory context)
    {
        // TODO: Implement the logic to pay for the paymaster transaction.
        context = abi.encode(_paymentData);
        _payForPaymasterTransaction(_paymentData.requiredETH);
    }

    function _prepareRefund(
        bytes calldata context,
        Transaction calldata _transaction,
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) internal view returns (PrepareRefundData memory refundData) {
        // TODO: Implement the logic to prepare refund for the paymaster.
        return PrepareRefundData({to: address(0), feeToCharge: 0, amount: 0});
    }

    function _refund(PrepareRefundData memory _refundData) internal {}
}
