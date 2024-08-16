// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IValidator, IModule, Transaction, ModuleType, ModuleMetadata} from "../interfaces/IModule.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract ERC721Gate is IValidator {
    mapping(address => address) private _gatekeepers;

    event Installed(address indexed account, address indexed erc721);
    event Uninstalled(address indexed account);

    function onInstall(bytes calldata _data) external payable override {
        address _erc721 = abi.decode(_data, (address));
        _onInstall(_erc721);
    }

    function onUninstall(bytes calldata) external override {
        address caller = msg.sender;

        _gatekeepers[caller] = address(0);

        emit Uninstalled(caller);
    }

    function validateTransaction(bytes32 _txHash, bytes32 _suggestedSignedHash, Transaction calldata _transaction)
        external
        view
        returns (bool isValid)
    {
        address caller = msg.sender; // paymaster
        address user = address(uint160(_transaction.from)); // user who signed the transaction

        if (!_isInstalled(caller)) {
            revert("ERC721Gate: module not installed");
        }

        isValid = IERC721(_gatekeepers[caller]).balanceOf(user) > 0;
    }

    function metadata() external pure override returns (ModuleMetadata memory) {
        return ModuleMetadata({
            moduleType: ModuleType.Validator,
            name: "ERC721Gate",
            version: "v0.0.1",
            author: "piatoss.eth",
            installDataSignature: "onInstall(address)"
        });
    }

    function isModuleType(ModuleType _moduleType) external pure override returns (bool) {
        return _moduleType == ModuleType.Validator;
    }

    function isInstalled(address _account) external view override returns (bool) {
        return _isInstalled(_account);
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return interfaceId == type(IValidator).interfaceId || interfaceId == type(IModule).interfaceId
            || interfaceId == type(IERC165).interfaceId;
    }

    function _onInstall(address _erc721) internal {
        if (_erc721 == address(0) || !IERC721(_erc721).supportsInterface(type(IERC721).interfaceId)) {
            revert("ERC721Gate: invalid ERC721");
        }

        address caller = msg.sender;

        if (_isInstalled(caller)) {
            revert("ERC721Gate: already installed");
        }

        _gatekeepers[caller] = _erc721;

        emit Installed(caller, _erc721);
    }

    function _isInstalled(address _account) internal view returns (bool) {
        return _gatekeepers[_account] != address(0);
    }
}
