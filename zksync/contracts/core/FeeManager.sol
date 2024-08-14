// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IFuzionPaymaster} from "../interfaces/IFuzionPaymaster.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract FeeManager is IFuzionPaymaster {
    error FailToTransferFee();

    address private _feeTo;

    constructor(address _feeToAddress) {
        _feeTo = _feeToAddress;
    }

    function _transferFee(address _token, uint256 _fee) internal {
        if (_feeTo == address(0)) {
            return;
        }

        if (_fee > 0) {
            SafeERC20.safeTransfer(IERC20(_token), _feeTo, _fee);
        }
    }

    function _setFeeTo(address _feeToAddress) internal {
        _feeTo = _feeToAddress;

        emit FeeToSet(_feeToAddress);
    }

    function feeTo() public view returns (address) {
        return _feeTo;
    }
}
