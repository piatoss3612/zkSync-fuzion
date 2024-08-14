// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BOOTLOADER_FORMAL_ADDRESS} from "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

abstract contract PaymasterBase {
    error OnlyBootloader();
    error FailedToTransferFundsToBootloader();
    error FailedToWithdrawFunds();
    error FailedToWithdrawTokenFunds();

    modifier onlyBootloader() {
        if (msg.sender != BOOTLOADER_FORMAL_ADDRESS) {
            revert OnlyBootloader();
        }
        _;
    }

    function _payForPaymasterTransaction(uint256 _requiredETH) internal {
        (bool success,) = payable(BOOTLOADER_FORMAL_ADDRESS).call{value: _requiredETH}("");
        if (!success) {
            revert FailedToTransferFundsToBootloader();
        }
    }

    function _withdraw(address payable _to, uint256 _amount) internal {
        (bool success,) = _to.call{value: _amount}("");
        if (!success) {
            revert FailedToWithdrawFunds();
        }
    }

    function _withdraw(address _token, address _to, uint256 _amount) internal {
        IERC20 token = IERC20(_token);
        bool transferred = token.transfer(_to, _amount);
        if (!transferred) {
            revert FailedToWithdrawTokenFunds();
        }
    }

    receive() external payable {}
}
