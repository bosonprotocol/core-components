/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const ethers = hre.ethers;

const OPENSEA_CONFIG = {
  feeAmount: 250,
  feeRecipient: "0x1111122222333334444455555666667777788888",
  conduitKey: ethers.ZeroHash, // = NO_CONDUIT
  conduit: ethers.ZeroAddress
};

async function deployWrappers(
  protocolAddress,
  wethAddress,
  unwrapperAddress,
  seaport
) {
  const { feeAmount, feeRecipient, conduitKey, conduit } = OPENSEA_CONFIG;
  const OpenSeaWrapperFactory = await ethers.getContractFactory(
    "OpenSeaWrapperFactory"
  );
  const openSeaWrapperFactory = await OpenSeaWrapperFactory.deploy(
    protocolAddress,
    wethAddress,
    unwrapperAddress,
    seaport,
    feeAmount,
    feeRecipient,
    conduitKey,
    conduitKey === ethers.ZeroHash
      ? seaport // Ensure the approval will be given to the seaport contract when NO_CONDUIT is defined
      : conduit
  );
  await openSeaWrapperFactory.waitForDeployment();
  return { openSeaWrapperFactory };
}

exports.deployWrappers = deployWrappers;
