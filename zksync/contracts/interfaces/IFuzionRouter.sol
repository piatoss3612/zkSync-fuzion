// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymasterFactory} from "./IPaymasterFactory.sol";

interface IFuzionRouter {
    error FuzionRouter__ZeroAddress();
    error FuzionRouter__PaymasterFactoryNotAvailable();

    event PaymasterFactorySet(IPaymasterFactory indexed paymasterFactory);
    event PaymasterCreated(
        IPaymasterFactory indexed paymasterFactory, address indexed paymaster, address indexed owner
    );

    function paymasterFactoryAvailable(IPaymasterFactory _paymasterFactory) external view returns (bool);
    function setPaymasterFactory(IPaymasterFactory _paymasterFactory) external;
    function createPaymaster(IPaymasterFactory _paymasterFactory, address _owner, bytes calldata _initData)
        external
        payable;
}
