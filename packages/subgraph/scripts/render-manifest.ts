import fs from "fs";
import handlebars from "handlebars";
import { providers } from "ethers";
import { addresses } from "../../contracts-sdk/src/addresses";

const generatedManifestsDir = __dirname + "/../generated/manifests";
const validEnvNames = ["local", "testing", "staging", "production"];

const envName = process.argv[2];

if (!validEnvNames.includes(envName)) {
  throw new Error(
    `Invalid env name "${envName}". Valid env names: ${validEnvNames.join(
      ", "
    )}.`
  );
}
const { protocolDiamond, chainId } = addresses[envName];

const isLocalhost = chainId === 31337;

const manifestTemplate = fs.readFileSync(
  __dirname + "/../subgraph.template.yaml"
);
const template = handlebars.compile(String(manifestTemplate));
const manifest = template({
  protocolDiamond,
  network: isLocalhost ? "localhost" : providers.getNetwork(chainId).name,
  startBlock: isLocalhost ? 0 : 10143000
});

if (!fs.existsSync(generatedManifestsDir)) {
  fs.mkdirSync(generatedManifestsDir, { recursive: true });
}

fs.writeFileSync(generatedManifestsDir + `/subgraph.${envName}.yaml`, manifest);
fs.writeFileSync(__dirname + "/../subgraph.yaml", manifest);
