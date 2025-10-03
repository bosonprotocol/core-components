/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const ethers = hre.ethers;

async function deployDRFeeMutualizer(
  bosonProtocolAddress,
  forwarderAddress,
  wethAddress
) {
  const DRFeeMutualizer = await ethers.getContractFactory("DRFeeMutualizer");
  const dRFeeMutualizer = await DRFeeMutualizer.deploy(
    bosonProtocolAddress,
    forwarderAddress,
    wethAddress
  );
  await dRFeeMutualizer.waitForDeployment();
  return dRFeeMutualizer;
}

exports.deployDRFeeMutualizer = deployDRFeeMutualizer;
