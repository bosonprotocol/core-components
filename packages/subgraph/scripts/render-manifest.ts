import fs from "fs";
import handlebars from "handlebars";
import { providers } from "ethers";
import { getDefaultConfigByEnvName } from "../../common/src/configs";

const generatedManifestsDir = __dirname + "/../generated/manifests";

const envName = process.argv[2];
const { contracts, chainId } = getDefaultConfigByEnvName(envName);

const isLocalhost = chainId === 31337;

const manifestTemplate = fs.readFileSync(
  __dirname + "/../subgraph.template.yaml"
);
const template = handlebars.compile(String(manifestTemplate));
const manifest = template({
  protocolDiamond: contracts.protocolDiamond,
  network: isLocalhost ? "localhost" : providers.getNetwork(chainId).name,
  startBlock: isLocalhost ? 0 : 12027000
});

if (!fs.existsSync(generatedManifestsDir)) {
  fs.mkdirSync(generatedManifestsDir, { recursive: true });
}

fs.writeFileSync(generatedManifestsDir + `/subgraph.${envName}.yaml`, manifest);
fs.writeFileSync(__dirname + "/../subgraph.yaml", manifest);
