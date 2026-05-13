/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const ethers = hre.ethers;

async function deployWeth() {
  const WETH9 = await ethers.getContractFactory("WETH9");
  const weth = await WETH9.deploy();
  await weth.waitForDeployment();
  return weth;
}

async function deployERC3009Token() {
  const MockERC3009Token = await ethers.getContractFactory("MockERC3009Token");
  const mockERC3009Token = await MockERC3009Token.deploy(
    "ERC3009Token",
    "ERC3009"
  );
  await mockERC3009Token.waitForDeployment();
  return mockERC3009Token;
}

async function deployERC2612Token() {
  const MockERC2612Token = await ethers.getContractFactory("MockERC2612Token");
  const mockERC2612Token = await MockERC2612Token.deploy(
    "ERC2612Token",
    "ERC2612"
  );
  await mockERC2612Token.waitForDeployment();
  return mockERC2612Token;
}

async function deployPermit2() {
  const MockPermit2 = await ethers.getContractFactory("MockPermit2");
  const mockPermit2 = await MockPermit2.deploy();
  await mockPermit2.waitForDeployment();
  return mockPermit2;
}

exports.deployERC3009Token = deployERC3009Token;
exports.deployERC2612Token = deployERC2612Token;
exports.deployPermit2 = deployPermit2;
exports.deployWeth = deployWeth;
