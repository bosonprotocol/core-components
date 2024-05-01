const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  deployOpenSeaWrapperFactory,
  deployMockBosonSellerHandler,
  deployMockBosonVoucher
} = require("./utils");

describe("OpenSeaWrapperFactory", () => {
  let mockBosonSellerHandler;

  const createSellerAndVoucher = async (sellerId) => {
    if (!mockBosonSellerHandler) {
      mockBosonSellerHandler = await deployMockBosonSellerHandler();
    }
    const sellerWallet = (await ethers.getSigners())[Number(sellerId)];
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
    const mockBosonVoucher = await deployMockBosonVoucher(seller.id);
    return { sellerWallet, mockBosonVoucher };
  };

  it("Deploy OpenSeaWrapperFactory", async () => {
    const protocolAddress = "0x1111111111111111111111111111111111111111";
    const openSeaWrapperFactory =
      await deployOpenSeaWrapperFactory(protocolAddress);
    const openSeaWrapperFactoryAddress =
      await openSeaWrapperFactory.getAddress();
    expect(!!openSeaWrapperFactoryAddress).to.be.true;
  });

  it("Create an OpenSeaWrapper", async () => {
    const { sellerWallet, mockBosonVoucher } =
      await createSellerAndVoucher("1");
    const protocolAddress = await mockBosonSellerHandler.getAddress();
    const openSeaWrapperFactory =
      await deployOpenSeaWrapperFactory(protocolAddress);
    const mockBosonVoucherAddress = await mockBosonVoucher.getAddress();
    const tx = await openSeaWrapperFactory
      .connect(sellerWallet)
      .create(mockBosonVoucherAddress);
    await tx.wait();
    const openSeaWrapperAddress = await openSeaWrapperFactory.getWrapper(
      mockBosonVoucherAddress
    );
    expect(!!openSeaWrapperAddress).to.be.true;
    const openSeaWrapper = await ethers.getContractAt(
      "OpenSeaWrapper",
      openSeaWrapperAddress
    );
    expect(!!openSeaWrapper).to.be.true;
    const iERC721InterfaceId = "0x80ac58cd";
    expect(await openSeaWrapper.supportsInterface(iERC721InterfaceId)).to.be
      .true;
  });
});
