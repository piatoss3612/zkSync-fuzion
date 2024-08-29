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
import {
    ModuleType,
    PreparePaymentData,
    PrepareRefundData,
    ModuleInitData,
    IValidator,
    IPayport,
    IHook
} from "./interfaces/IModule.sol";
import {ModuleManager} from "./core/ModuleManager.sol";
import {FeeManager} from "./core/FeeManager.sol";

// OpenZeppelin
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FuzionPaymaster is ModuleManager, FeeManager, Initializable, Ownable {
    /*//////////////////////////////////////////////////////////////
                            MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier hookExecution(bytes32 _txHash, bytes32 _suggestedSignedHash, Transaction calldata _transaction) {
        bytes memory hookContext =
            _beforeValidateAndPayForPaymasterTransaction(_txHash, _suggestedSignedHash, _transaction);
        _;
        _afterValidateAndPayForPaymasterTransaction(hookContext);
    }

    /*//////////////////////////////////////////////////////////////
                            CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor(address _owner, address _feeToAddress) payable FeeManager(_feeToAddress) Ownable(_owner) {}

    /*//////////////////////////////////////////////////////////////
                             FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function initialize(bytes calldata _initData) external override initializer {
        if (_initData.length == 0) {
            // No default modules to install
            return;
        }

        // Initialize the default modules
        ModuleInitData[] memory modules = abi.decode(_initData, (ModuleInitData[]));
        for (uint256 i = 0; i < modules.length; i++) {
            ModuleInitData memory initData = modules[i];

            // validate and install the module
            _installModule(initData.moduleType, initData.module, initData.initData);

            if (initData.isDefault) {
                // set the default module (no validation required as it was already validated during installation)
                _setDefaultModuleWithoutValidation(initData.moduleType, initData.module);
            }
        }
    }

    function validateAndPayForPaymasterTransaction(
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    )
        external
        payable
        onlyBootloader
        hookExecution(_txHash, _suggestedSignedHash, _transaction)
        returns (bytes4 magic, bytes memory context)
    {
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
        // If there is no default validator, the transaction is considered valid by default.
        magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;

        address[] memory _validators = defaultValidators();

        // Validate the transaction. If any validator fails,
        // the transaction is considered invalid, but not reverted immediately.
        for (uint256 i = 0; i < _validators.length; i++) {
            try IValidator(_validators[i]).validateTransaction(_txHash, _suggestedSignedHash, _transaction) returns (
                bool isValid
            ) {
                if (!isValid) {
                    magic = bytes4(0);
                    reason = "Transaction validation failed.";
                    break;
                }
            } catch (bytes memory returnData) {
                magic = bytes4(0);
                reason = string(returnData);
                break;
            }
        }
    }

    function _preparePayment(Transaction calldata _transaction)
        internal
        returns (PreparePaymentData memory paymentData)
    {
        address _defaultPayport = defaultPayport();
        if (_defaultPayport != address(0)) {
            return IPayport(_defaultPayport).preparePayment(_transaction);
        }

        // If there is no default payport, the payment is considered prepared by default.
        if (_transaction.paymasterInput.length < 4) {
            revert InvalidPaymasterInput();
        }

        bytes4 paymasterInputSelector = bytes4(_transaction.paymasterInput[0:4]);
        if (paymasterInputSelector != IPaymasterFlow.general.selector) {
            revert UnsupportedPaymasterFlow();
        }

        paymentData = PreparePaymentData({
            paymasterInputSelector: paymasterInputSelector,
            from: address(0),
            token: address(0),
            requiredETH: uint96(_transaction.gasLimit * _transaction.maxFeePerGas),
            requiredToken: 0,
            extraData: ""
        });
    }

    function _payForPaymasterTransaction(PreparePaymentData memory _paymentData)
        internal
        returns (bytes memory context)
    {
        // Encode the payment data to be returned as context.
        context = abi.encode(_paymentData);

        // Check if the paymaster flow is approval-based.
        if (_paymentData.paymasterInputSelector == IPaymasterFlow.approvalBased.selector) {
            // Transfer the required amount of token to this contract.
            SafeERC20.safeTransferFrom(
                IERC20(_paymentData.token), _paymentData.from, address(this), _paymentData.requiredToken
            );
        }

        // Transfer the required amount of ETH to the paymaster.
        _payForPaymasterTransaction(_paymentData.requiredETH);
    }

    function _prepareRefund(
        bytes calldata context,
        Transaction calldata _transaction,
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) internal returns (PrepareRefundData memory refundData) {
        // Decode the payment data from the context.
        PreparePaymentData memory paymentData = abi.decode(context, (PreparePaymentData));

        // If there is no default payport, the refund is not supported.
        address _defaultPayport = defaultPayport();
        if (_defaultPayport != address(0)) {
            refundData = IPayport(_defaultPayport).prepareRefund(
                _transaction, paymentData, _txHash, _suggestedSignedHash, _txResult, _maxRefundedGas
            );
        }
    }

    function _refund(PrepareRefundData memory _refundData) internal {
        // If amount is greater than 0, transfer the refund amount to the user.
        if (_refundData.amount > 0) {
            // Transfer the refund amount to the user.
            SafeERC20.safeTransfer(IERC20(_refundData.token), _refundData.to, _refundData.amount);
        }

        // If feeTo is set, transfer the fee to the feeTo address.
        _transferFee(_refundData.token, _refundData.fee);
    }

    function _beforeValidateAndPayForPaymasterTransaction(
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) internal returns (bytes memory hookContext) {
        address _defaultHook = defaultHook();
        if (_defaultHook != address(0)) {
            hookContext = IHook(_defaultHook).preCheck(_txHash, _suggestedSignedHash, _transaction);
        }
    }

    function _afterValidateAndPayForPaymasterTransaction(bytes memory hookContext) internal {
        address _defaultHook = defaultHook();
        if (_defaultHook != address(0)) {
            IHook(_defaultHook).postCheck(hookContext);
        }
    }
}
