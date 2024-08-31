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
    mapping(address module => RatingData ratingData) private _moduleRatings;
    mapping(address module => mapping(address rater => bool rated)) private _moduleRatedBy;

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
        if (_isModuleRegistered(_module)) {
            revert FuzionRouter__ModuleAlreadyRegistered();
        }

        ModuleMetadata memory metadata = IModule(_module).metadata();

        _modules[_module] = true;

        emit ModuleRegistered(address(_module), metadata.moduleType, metadata.name);
    }

    function isModuleRegistered(address _module) external view returns (bool) {
        return _isModuleRegistered(_module);
    }

    function rateModule(address _module, Rating _rating) external {
        if (!_isModuleRegistered(_module)) {
            revert FuzionRouter__ModuleNotRegistered(_module);
        }

        address rater = msg.sender;

        if (hasRatedModule(rater, _module)) {
            revert FuzionRouter__ModuleAlreadyRated(_module, rater);
        }

        RatingData storage ratingData = _moduleRatings[_module];

        ratingData.accumulativeRating += uint128(_rating);
        ratingData.accumulativeRatingCount++;

        emit ModuleRatingUpdated(
            _module, rater, _rating, ratingData.accumulativeRating, ratingData.accumulativeRatingCount
        );
    }

    function getModuleRatingData(address _module) external view override returns (RatingData memory) {
        return _moduleRatings[_module];
    }

    function _isModuleRegistered(address _module) internal view returns (bool) {
        return _modules[_module];
    }

    function hasRatedModule(address _rater, address _module) public view returns (bool) {
        return _moduleRatedBy[_module][_rater];
    }
}
