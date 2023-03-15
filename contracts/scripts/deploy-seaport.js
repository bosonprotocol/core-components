/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const ethers = hre.ethers;

async function deploySeaport() {
  const ConduitController = await ethers.getContractFactory(
    "ConduitController"
  );
  const conduitController = await ConduitController.deploy();
  await conduitController.deployed();
  const Seaport = await ethers.getContractFactory("Seaport");
  const seaport = await Seaport.deploy(conduitController.address);
  await seaport.deployed();
  return seaport;
}

exports.deploySeaport = deploySeaport;
