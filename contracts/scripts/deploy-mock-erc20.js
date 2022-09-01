/* eslint @typescript-eslint/no-var-requires: "off" */
const hre = require("hardhat");
const ethers = hre.ethers;

const {
  deploymentComplete,
  verifyOnTestEnv,
  delay
} = require("../protocol-contracts/scripts/util/report-verify-deployments");
const {
  deployMockTokens
} = require("../protocol-contracts/scripts/util/deploy-mock-tokens");

const gasLimit = "2000000";

async function main() {
  // Compile everything (in case run by node)
  await hre.run("compile");

  // Deployed contracts
  let contracts = [];

  // Output script header
  const divider = "-".repeat(80);

  console.log(`⛓  Network: ${hre.network.name}\n📅 ${new Date()}`);

  // Get the accounts
  const accounts = await ethers.provider.listAccounts();
  const deployer = accounts[0];
  console.log(
    "🔱 Deployer account: ",
    deployer ? deployer : "not found" && process.exit()
  );
  console.log(divider);

  // Deploy ERC20-compliant mock token for testing
  const [foreign20Token] = await deployMockTokens(gasLimit, ["Foreign20"]);
  deploymentComplete("Foreign20", foreign20Token.address, [], contracts);

  await foreign20Token.mint(
    "0x57faFe1fB7C682216FCe44e50946C5249192b9D5",
    ethers.utils.parseEther("1000000")
  );
  await foreign20Token.mint(
    "0x9c2925a41d6FB1c6C8f53351634446B0b2E65eE8",
    ethers.utils.parseEther("1000000")
  );

  // Bail now if deploying locally
  if (hre.network.name === "localhost") {
    process.exit();
  }

  // console.log("🔍 Verifying contracts on Blockexplorer...");
  // await verifyOnTestEnv(contracts);

  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
