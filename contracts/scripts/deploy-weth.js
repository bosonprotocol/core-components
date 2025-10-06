/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const ethers = hre.ethers;

async function deployWeth() {
  const WETH9 = await ethers.getContractFactory("WETH9");
  const weth = await WETH9.deploy();
  await weth.waitForDeployment();
  return weth;
}

exports.deployWeth = deployWeth;
