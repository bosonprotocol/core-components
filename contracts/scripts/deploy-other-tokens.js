/* eslint-disable @typescript-eslint/no-var-requires */
const { Contract } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

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
  // Inject MockPermit2 at the canonical Permit2 address. The Permit2
  // sub-context relies on this code being present at PERMIT2_ADDRESS so
  // `TokenTransferAuthorizationLib._consumePermit2` calls land on it.
  const code = await ethers.provider.getCode(await mockPermit2.getAddress());
  await hre.network.provider.send("hardhat_setCode", [PERMIT2_ADDRESS, code]);
  return new Contract(PERMIT2_ADDRESS, MockPermit2.interface, ethers.provider);
}

exports.deployERC3009Token = deployERC3009Token;
exports.deployERC2612Token = deployERC2612Token;
exports.deployPermit2 = deployPermit2;
exports.deployWeth = deployWeth;
