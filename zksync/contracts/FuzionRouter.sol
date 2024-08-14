// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IFuzionRouter} from "./interfaces/IFuzionRouter.sol";
import {IFuzionPaymaster} from "./interfaces/IFuzionPaymaster.sol";
import {IModule, ModuleType, ModuleMetadata} from "./interfaces/IModule.sol";
import {FuzionPaymasterFactory} from "./FuzionPaymasterFactory.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FuzionRouter is IFuzionRouter, Ownable {
    FuzionPaymasterFactory private immutable _paymasterFactory;

    mapping(address module => bool isModuleRegistered) private _modules;

    constructor(address _paymasterFactoryAddress, address _owner) Ownable(_owner) {
        _paymasterFactory = FuzionPaymasterFactory(_paymasterFactoryAddress);
    }

    function factory() external view override returns (address) {
        return address(_paymasterFactory);
    }

    function createPaymaster(
        bytes32 _salt,
        address _owner,
        address _feeTo,
        string calldata _alias,
        bytes calldata _initData
    ) external payable override {
        address paymaster = _paymasterFactory.getPaymasterAddress(_salt, _owner, _feeTo);
        if (paymaster != _paymasterFactory.createPaymaster{value: msg.value}(_salt, _owner, _feeTo)) {
            revert FuzionRouter__NotExpectedPaymaster();
        }

        emit PaymasterCreated(paymaster, _owner, _alias);

        IFuzionPaymaster(paymaster).initialize(_initData);
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
