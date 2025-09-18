/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const ethers = hre.ethers;

async function deployDRFeeMutualizer(bosonProtocolAddress, forwarderAddress) {
  const DRFeeMutualizer = await ethers.getContractFactory("DRFeeMutualizer");
  const dRFeeMutualizer = await DRFeeMutualizer.deploy(
    bosonProtocolAddress,
    forwarderAddress
  );
  await dRFeeMutualizer.waitForDeployment();
  return dRFeeMutualizer;
}

exports.deployDRFeeMutualizer = deployDRFeeMutualizer;
