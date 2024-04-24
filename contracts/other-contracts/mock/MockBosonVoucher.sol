// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.22;

contract MockBosonVoucher {
  uint256 private sellerId;
  string public name = "vouchers";
  string public symbol = "VCHRS";

  constructor(uint256 _sellerId) {
    require(_sellerId != 0, "SellerId can't be 0");
    sellerId = _sellerId;
  }
  function getSellerId() external view returns (uint256) {
    return sellerId;
  }
}