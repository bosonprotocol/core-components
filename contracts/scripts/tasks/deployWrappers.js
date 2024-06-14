async function deployWrappersTask(
  hre,
  protocolAddress,
  unwrapperAddress,
  seaport
) {
  const OPENSEA_CONFIG =
    hre.network.config.chainId === 31337
      ? {
          feeAmount: 250,
          feeRecipient: "0x1111122222333334444455555666667777788888",
          conduitKey: hre.ethers.ZeroHash, // = NO_CONDUIT
          conduit: hre.ethers.ZeroAddress
        }
      : {
          feeAmount: 250,
          feeRecipient: "0x0000a26b00c1F0DF003000390027140000fAa719",
          conduitKey:
            "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
          conduit: "0x1e0049783f008a0085193e00003d00cd54003c71"
        };

  const { feeAmount, feeRecipient, conduitKey, conduit } = OPENSEA_CONFIG;
  const OpenSeaWrapperFactory = await hre.ethers.getContractFactory(
    "OpenSeaWrapperFactory"
  );
  console.log(
    `Deploy OpenSeaWrapperFactory on network ${hre.network.name} with OpenSea config = ${JSON.stringify(OPENSEA_CONFIG)}`
  );
  const openSeaWrapperFactory = await OpenSeaWrapperFactory.deploy(
    protocolAddress,
    unwrapperAddress,
    seaport,
    feeAmount,
    feeRecipient,
    conduitKey,
    conduitKey === hre.ethers.ZeroHash
      ? seaport // Ensure the approval will be given to the seaport contract when NO_CONDUIT is defined
      : conduit
  );
  await openSeaWrapperFactory.waitForDeployment();
  console.log(
    `OpenSeaWrapperFactory deployed at ${await openSeaWrapperFactory.getAddress()}`
  );
  return { openSeaWrapperFactory };
}

exports.deployWrappersTask = deployWrappersTask;
