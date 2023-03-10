/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const ethers = hre.ethers;

async function deployMockSeaport() {
  const MockSeaport = await ethers.getContractFactory("MockSeaport");
  const mockSeaport = await MockSeaport.deploy();
  await mockSeaport.deployed();
  return mockSeaport;
}

exports.deployMockSeaport = deployMockSeaport;
