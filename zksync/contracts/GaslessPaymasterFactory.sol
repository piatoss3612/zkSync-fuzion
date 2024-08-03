// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymaster} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFactory} from "./interfaces/IPaymasterFactory.sol";
import {GaslessPaymaster} from "./GaslessPaymaster.sol";

contract GaslessPaymasterFactory is IPaymasterFactory {
    function name() external pure returns (string memory) {
        return "GaslessPaymasterFactory";
    }

    function createPaymaster(address _owner, bytes calldata) external payable returns (IPaymaster paymaster) {
        paymaster = new GaslessPaymaster{value: msg.value}(_owner);

        emit PaymasterCreated(address(paymaster), _owner);
    }
}
