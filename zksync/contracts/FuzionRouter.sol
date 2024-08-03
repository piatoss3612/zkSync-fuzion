// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IFuzionRouter} from "./interfaces/IFuzionRouter.sol";
import {IPaymasterFactory, IPaymaster} from "./interfaces/IPaymasterFactory.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FuzionRouter is IFuzionRouter, Ownable {
    mapping(IPaymasterFactory => bool) private _paymasterFactories;

    constructor(address _owner) payable Ownable(_owner) {}

    function paymasterFactoryAvailable(IPaymasterFactory _paymasterFactory) external view override returns (bool) {
        return _paymasterFactoryAvailable(_paymasterFactory);
    }

    function _paymasterFactoryAvailable(IPaymasterFactory _paymasterFactory) internal view returns (bool) {
        return _paymasterFactories[_paymasterFactory];
    }

    function setPaymasterFactory(IPaymasterFactory _paymasterFactory) external override onlyOwner {
        if (address(_paymasterFactory) == address(0)) {
            revert FuzionRouter__ZeroAddress();
        }

        _paymasterFactories[_paymasterFactory] = true;

        emit PaymasterFactorySet(_paymasterFactory);
    }

    function createPaymaster(IPaymasterFactory _paymasterFactory, address _owner, bytes calldata _initData)
        external
        payable
        override
    {
        if (!_paymasterFactoryAvailable(_paymasterFactory)) {
            revert FuzionRouter__PaymasterFactoryNotAvailable();
        }

        IPaymaster paymaster = _paymasterFactory.createPaymaster{value: msg.value}(_owner, _initData);

        emit PaymasterCreated(_paymasterFactory, address(paymaster), _owner);
    }
}
