const { ethers } = require("hardhat");

async function deployMockBosonVoucher(sellerId) {
  const MockBosonVoucher = await ethers.getContractFactory("MockBosonVoucher");
  const mockBosonVoucher = await MockBosonVoucher.deploy(sellerId);
  await mockBosonVoucher.waitForDeployment();
  return mockBosonVoucher;
}

async function deployMockBosonSellerHandler() {
  const MockBosonSellerHandler = await ethers.getContractFactory(
    "MockBosonSellerHandler"
  );
  const mockBosonSellerHandler = await MockBosonSellerHandler.deploy();
  await mockBosonSellerHandler.waitForDeployment();
  return mockBosonSellerHandler;
}

async function deployOpenSeaWrapperFactory(protocolAddress) {
  const unwrapperAddress = "0x3333333333333333333333333333333333333333";
  const seaport = "0x4444444444444444444444444444444444444444";
  const openSeaFee = "250";
  const openSeaRecipient = "0x5555555555555555555555555555555555555555";
  const openSeaConduitKey =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const openSeaConduit = "0x6666666666666666666666666666666666666666";
  const OpenSeaWrapperFactory = await ethers.getContractFactory(
    "OpenSeaWrapperFactory"
  );
  const openSeaWrapperFactory = await OpenSeaWrapperFactory.deploy(
    protocolAddress,
    unwrapperAddress,
    seaport,
    openSeaFee,
    openSeaRecipient,
    openSeaConduitKey,
    openSeaConduit
  );
  return openSeaWrapperFactory.waitForDeployment();
}

module.exports = {
  deployMockBosonVoucher,
  deployMockBosonSellerHandler,
  deployOpenSeaWrapperFactory
};
