/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require("hardhat");
const { deployWrappersTask } = require("./tasks/deployWrappers");

async function deployWrappers(
  protocolAddress,
  wethAddress,
  unwrapperAddress,
  seaport
) {
  return deployWrappersTask(
    hre,
    protocolAddress,
    wethAddress,
    unwrapperAddress,
    seaport
  );
}

exports.deployWrappers = deployWrappers;
