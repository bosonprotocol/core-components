import { Option, program } from "commander";
import fs from "fs";
program
  .description("Post subgraph deployment treatment with Ormi")
  .addOption(
    new Option(
      "--env <ENV>",
      `Deployed environment (Boson env + chain): "testing_amoy", "testing_sepolia", ...`
    )
      .makeOptionMandatory(true)
      .choices([
        "testing_amoy",
        "testing_sepolia",
        "staging_amoy",
        "staging_sepolia",
        "production_polygon",
        "production_ethereum"
      ])
  )
  .parse(process.argv);

/**
 * 1. check the old version of current "latest"-tagged subgraph
 * 2. deploy the new version
 * 3. if OK, then
 * 3.1. remove the "latest" tag from old version
 * 3.2. add the "latest" tag on new version
 * 3.3. remove the old version
 * 3.4. log the new version to be able to find it back next time
 */

const { env } = program.opts();
const baseUrl = `https://api.0xgraph.xyz/public_api/v1/0xgraph`;
const queryTagUrl = `${baseUrl}/query_tag`;
const createTagUrl = `${baseUrl}/create_tag`;
const deleteTagUrl = `${baseUrl}/delete_tag`;
const removeSubgraphUrl = `${baseUrl}/remove_subgraph`;
const requiredEnvVars = [
  "ORMI_0x_GRAPH_API_KEY", // should be set in GH pipeline from GH action secret depending on the env
  `npm_package_config_${env}`, // subgraphName
  "npm_package_version" // newVersion
];
const ormiApiKey = process.env.ORMI_0x_GRAPH_API_KEY as string;

function checkEnvVars() {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable '${envVar}'`);
    }
  }
}

async function checkTag(
  subgraphName: string,
  subgraphVersion: string,
  subgraphTag: string
): Promise<boolean> {
  const tags = await queryTags(subgraphName, subgraphVersion);
  const hasTag = !!tags?.some((tag) => tag.tag === subgraphTag);
  console.log("checkTag()", { hasTag });
  return hasTag;
}

async function queryTags(
  subgraphName: string,
  subgraphVersion: string
): Promise<{ tag: string; create_time: number }[] | undefined> {
  try {
    const response = await fetch(queryTagUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ormiApiKey}`
      },
      body: JSON.stringify({
        subgraph_name: subgraphName,
        version: subgraphVersion
      })
    });
    if (response.ok) {
      const { data } = (await response.json()) as {
        data: { tags?: { tag: string; create_time: number }[] };
      };
      console.log("queryTags()", { data });
      return data?.tags;
    }
    console.error(response.statusText);
  } catch (e) {
    console.error(e);
    throw e;
  }
  return undefined;
}

async function removeTag(
  subgraphName: string,
  subgraphVersion: string,
  subgraphTag: string
) {
  console.log(`removeTag(${subgraphName}, ${subgraphVersion}, ${subgraphTag})`);
  const response = await fetch(deleteTagUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ormiApiKey}`
    },
    body: JSON.stringify({
      subgraph_name: subgraphName,
      version: subgraphVersion,
      tag: subgraphTag
    })
  });
  if (!response.ok) {
    console.error(response.statusText);
  }
}

async function createTag(
  subgraphName: string,
  subgraphVersion: string,
  subgraphTag: string
) {
  console.log(`createTag(${subgraphName}, ${subgraphVersion}, ${subgraphTag})`);
  const response = await fetch(createTagUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ormiApiKey}`
    },
    body: JSON.stringify({
      subgraph_name: subgraphName,
      version: subgraphVersion,
      tag: subgraphTag
    })
  });
  if (!response.ok) {
    console.error(response.statusText);
  }
}

async function removeSubgraph(subgraphName: string, subgraphVersion: string) {
  console.log(`removeSubgraph(${subgraphName}, ${subgraphVersion})`);
  const response = await fetch(removeSubgraphUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ormiApiKey}`
    },
    body: JSON.stringify({
      name: subgraphName,
      version: subgraphVersion
    })
  });
  if (!response.ok) {
    console.error(response.statusText);
  }
}

function getOldLatestVersion(subgraphName: string): string | undefined {
  const oldVersion = readLog(subgraphName)?.version;
  console.log(`getOldLatestVersion(${subgraphName})`, { oldVersion });
  return oldVersion;
}

function saveLog(subgraphName: string, subgraphVersion: string) {
  const filename = `./logs/${subgraphName}`;
  const data = {
    timestamp: Math.floor(Date.now() / 1000).toString(),
    version: subgraphVersion
  };
  console.log(`saveLog(${{ subgraphName, subgraphVersion }})`, filename, data);
  fs.mkdirSync(`./logs`, { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(data, undefined, 2));
}

function readLog(subgraphName: string):
  | {
      timestamp: string;
      version: string;
    }
  | undefined {
  const filename = `./logs/${subgraphName}`;
  let data = undefined;
  if (fs.existsSync(filename)) {
    const raw = fs.readFileSync(filename);
    data = JSON.parse(raw.toString());
  }
  console.log(`readLog(${{ subgraphName }})`, filename, data);
  return data;
}

async function main() {
  checkEnvVars();
  const subgraphName = process.env[`npm_package_config_${env}`] as string;
  const newVersion = process.env["npm_package_version"] as string;
  const subgraphTag = "latest";
  await createTag(subgraphName, newVersion, subgraphTag);
  // Check the tag has been set. If not, it means the deployment may have failed, so we quit
  const hasTag = await checkTag(subgraphName, newVersion, subgraphTag);
  if (hasTag) {
    const oldVersion = getOldLatestVersion(subgraphName);
    saveLog(subgraphName, newVersion);
    if (oldVersion && oldVersion !== newVersion) {
      const hasTag = await checkTag(subgraphName, oldVersion, subgraphTag);
      if (hasTag) {
        await removeTag(subgraphName, oldVersion, subgraphTag);
      }
      await removeSubgraph(subgraphName, oldVersion);
    }
  }
}

main()
  .then(() => {
    console.log("OK");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
