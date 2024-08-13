// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymaster} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IFuzionRouter} from "./interfaces/IFuzionRouter.sol";
import {IModule, ModuleType, ModuleMetadata} from "./interfaces/IModule.sol";
import {FuzionPaymasterFactory} from "./FuzionPaymasterFactory.sol";
import {FuzionPaymaster} from "./FuzionPaymaster.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FuzionRouter is IFuzionRouter, Ownable {
    FuzionPaymasterFactory private immutable _paymasterFactory;

    mapping(address paymaster => bool isPaymasterRegistered) private _paymasters;
    mapping(address module => bool isModuleRegistered) private _modules;

    constructor(address _paymasterFactoryAddress, address _owner) Ownable(_owner) {
        _paymasterFactory = FuzionPaymasterFactory(_paymasterFactoryAddress);
    }

    function factory() external view override returns (address) {
        return address(_paymasterFactory);
    }

    function createPaymaster(address _owner, string calldata _alias, bytes calldata _initData)
        external
        payable
        override
    {
        address paymaster = _paymasterFactory.createPaymaster{value: msg.value}(_owner, _initData);

        _paymasters[paymaster] = true;

        emit PaymasterCreated(paymaster, _owner, _alias);
    }

    function registerModule(address _module) external override {
        if (_modules[_module]) {
            revert FuzionRouter__ModuleAlreadyRegistered();
        }

        ModuleMetadata memory metadata = IModule(_module).metadata();

        _modules[_module] = true;

        emit ModuleRegistered(address(_module), metadata.moduleType, metadata.name);
    }
}
