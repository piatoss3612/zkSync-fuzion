// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IFuzionPaymaster} from "../interfaces/IFuzionPaymaster.sol";

abstract contract FeeManager is IFuzionPaymaster {
    error FailToTransferFee();

    address private _feeTo;

    constructor(address _feeToAddress) {
        _feeTo = _feeToAddress;
    }

    function _transferFee(uint256 _fee) internal {
        if (_feeTo == address(0)) {
            return;
        }

        if (_fee > 0) {
            (bool success,) = _feeTo.call{value: _fee}("");
            if (!success) {
                revert FailToTransferFee();
            }
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
