/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const ethers = hre.ethers;

async function deploySeaport() {
  const ConduitController =
    await ethers.getContractFactory("ConduitController");
  const conduitController = await ConduitController.deploy();
  await conduitController.waitForDeployment();
  const Seaport = await ethers.getContractFactory("Seaport");
  const seaport = await Seaport.deploy(await conduitController.getAddress());
  await seaport.waitForDeployment();
  return seaport;
}

exports.deploySeaport = deploySeaport;
