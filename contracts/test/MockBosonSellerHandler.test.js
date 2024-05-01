const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployMockBosonSellerHandler } = require ("./utils");

describe("MockBosonSellerHandler", () => {
  it("Deploy MockBosonSellerHandler", async () => {
    const mockBosonSellerHandler = await deployMockBosonSellerHandler();
    const mockBosonSellerHandlerAddress = await mockBosonSellerHandler.getAddress();
    expect(!!mockBosonSellerHandlerAddress).to.be.true;
  });

  it("MockBosonSellerHandler setSeller()/getSeller()", async () => {
    const mockBosonSellerHandler = await deployMockBosonSellerHandler();
    for (let sellerId = 1; sellerId < 3; sellerId++) {
      const sellerWallet = (await ethers.getSigners())[sellerId];
      const sellerAddress = await sellerWallet.getAddress();
      const seller = {
        id: sellerId,
        assistant: sellerAddress,
        admin: sellerAddress,
        clerk: ethers.ZeroAddress,
        treasury: sellerAddress,
        active: true,
        metadataUri: ""
      };
      const tx = await mockBosonSellerHandler.setSeller(seller);
      await tx.wait();
    }
    for (let sellerId = 1; sellerId < 3; sellerId++) {
      const [, readSeller] = await mockBosonSellerHandler.getSeller(sellerId);
      expect(readSeller.id).to.equal(sellerId);
    }
  });

  it("MockBosonSellerHandler setSeller() fails if sellerId is 0", async () => {
    const sellerWallet = (await ethers.getSigners())[1];
    const sellerAddress = await sellerWallet.getAddress();
    const seller = {
      id: "0",
      assistant: sellerAddress,
      admin: sellerAddress,
      clerk: ethers.ZeroAddress,
      treasury: sellerAddress,
      active: true,
      metadataUri: ""
    };
    const mockBosonSellerHandler = await deployMockBosonSellerHandler();
    await expect(mockBosonSellerHandler.setSeller(seller)).to.revertedWith(
      "SellerId can't be 0"
    );
  });

  it("MockBosonSellerHandler getSeller() fails if no existing seller", async () => {
    const sellerWallet = (await ethers.getSigners())[1];
    const sellerAddress = await sellerWallet.getAddress();
    const seller = {
      id: "1",
      assistant: sellerAddress,
      admin: sellerAddress,
      clerk: ethers.ZeroAddress,
      treasury: sellerAddress,
      active: true,
      metadataUri: ""
    };
    const mockBosonSellerHandler = await deployMockBosonSellerHandler();
    await expect(mockBosonSellerHandler.getSeller(seller.id)).to.revertedWith(
      "Seller not found"
    );
  });

  it("MockBosonSellerHandler setSeller()/getSeller() fails if sellerId not found", async () => {
    const sellerWallet = (await ethers.getSigners())[1];
    const sellerAddress = await sellerWallet.getAddress();
    const seller = {
      id: "1",
      assistant: sellerAddress,
      admin: sellerAddress,
      clerk: ethers.ZeroAddress,
      treasury: sellerAddress,
      active: true,
      metadataUri: ""
    };
    const mockBosonSellerHandler = await deployMockBosonSellerHandler();
    const tx = await mockBosonSellerHandler.setSeller(seller);
    await tx.wait();
    await expect(mockBosonSellerHandler.getSeller("2")).to.revertedWith(
      "Seller not found"
    );
  });
});
