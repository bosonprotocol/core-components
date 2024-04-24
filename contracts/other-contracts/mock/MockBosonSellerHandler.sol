// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.22;

import { BosonTypes } from "../../protocol-contracts/contracts/domain/BosonTypes.sol";

contract MockBosonSellerHandler {
  mapping(uint256 => BosonTypes.Seller) sellers;

  function setSeller(BosonTypes.Seller calldata _seller) external {
    require (_seller.id != 0, "SellerId can't be 0");
    sellers[_seller.id] = _seller;
  }
  function getSeller(uint256 _sellerId) external view returns (bool exists, BosonTypes.Seller memory seller, BosonTypes.AuthToken memory authToken) {
    seller = sellers[_sellerId];
    require (seller.id != 0, "Seller not found");
    exists = true;
  }
}