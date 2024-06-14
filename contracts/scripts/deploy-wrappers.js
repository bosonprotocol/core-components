/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const { deployWrappersTask } = require("./tasks/deployWrappers");

async function deployWrappers(protocolAddress, unwrapperAddress, seaport) {
  return deployWrappersTask(hre, protocolAddress, unwrapperAddress, seaport);
}

exports.deployWrappers = deployWrappers;
