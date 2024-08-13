// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymaster} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {FuzionPaymaster} from "./FuzionPaymaster.sol";

contract FuzionPaymasterFactory {
    event PaymasterCreated(address paymaster, address owner);

    // TODO: use create2 to deploy paymaster
    function createPaymaster(address _owner, bytes calldata) external payable returns (address paymaster) {
        paymaster = address(new FuzionPaymaster{value: msg.value}(_owner));

        emit PaymasterCreated(paymaster, _owner);
    }
}
