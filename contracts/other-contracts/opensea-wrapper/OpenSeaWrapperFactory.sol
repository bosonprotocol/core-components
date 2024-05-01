// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.22;

import { OpenSeaWrapper } from './OpenSeaWrapper.sol';
import { BosonTypes } from "../../protocol-contracts/contracts/domain/BosonTypes.sol";

contract OpenSeaWrapperFactory {
    address private protocolAddress;
    address private unwrapperAddress;
    address private wethAddress;
    address private seaport;
    uint256 private openSeaFee;
    address payable openSeaRecipient;
    bytes32 private openSeaConduitKey;
    address private openSeaConduit;
    mapping (address => address) private wrappers;

    constructor(
        address _protocolAddress,
        address _wethAddress,
        address _unwrapperAddress,
        address _seaport,
        uint256 _openSeaFee,
        address payable _openSeaRecipient,
        bytes32 _openSeaConduitKey,
        address _openSeaConduit
    ) {
        protocolAddress = _protocolAddress;
        wethAddress = _wethAddress;
        unwrapperAddress = _unwrapperAddress;
        seaport = _seaport;
        openSeaFee = _openSeaFee;
        openSeaRecipient = _openSeaRecipient;
        openSeaConduitKey = _openSeaConduitKey;
        openSeaConduit = _openSeaConduit;
    }

    function create(address _voucherContract) external returns (address) {
        // Check no wrapper exists for this voucher contract
        require(wrappers[_voucherContract] == address(0), "Voucher is already wrapped");
        // Create the wrapper
        OpenSeaWrapper wrapper = new OpenSeaWrapper(
            _voucherContract,
            protocolAddress,
            wethAddress,
            unwrapperAddress,
            seaport,
            openSeaFee,
            openSeaRecipient,
            openSeaConduitKey,
            openSeaConduit
        );
        // Store the wrapper to avoid creating another for the same voucher contract
        wrappers[_voucherContract] = address(wrapper);
        return address(wrapper);
    }

    function getWrapper(address _voucherContract) external view returns (address) {
      return wrappers[_voucherContract];
    }
}
