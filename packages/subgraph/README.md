# @bosonprotocol/subgraph

Official subgraph of the Boson Protocol.

| Network   | Subgraph ID | Endpoint |
| --------- | ----------- | -------- |
| `ropsten` | `TBD`       | `TBD`    |
| `rinkeby` | `TBD`       | `TBD`    |
| `mainnet` | `TBD`       | `TBD`    |

## Local development

The required steps to develop and test the subgraph locally is as follows:

1. Set up hardhat node with v2 contracts locally
2. Set up Graph Node locally
3. Initialize and deploy subgraph
4. Query the subgraph

### 1. Set up hardhat node with v2 contracts locally

Clone the v2 contracts repository, checkout the `core-components-playground` branch and install dependencies:

```bash
git clone https://github.com/dohaki/contracts-v2
cd contracts-v2
git checkout core-components-playground
npm i
```

Start a local hardhat node in one terminal with the flag `--hostname 0.0.0.0`:

```bash
npx hardhat node --hostname 0.0.0.0
```

In another terminal deploy the v2 contracts to the local hardhat node:

```bash
npm run deploy-suite:local
```

### 2. Set up Graph Node locally

In a new terminal clone the Graph Node repository and enter the `docker` directory:

```bash
git clone https://github.com/graphprotocol/graph-node
cd graph-node/docker
```

**Only for Linux users:** Linux does not support the `host.docker.internal` alias for the host machine that The Graph Node Docker Compose uses. Run the following command from the Docker directory to replace the alias with the host IP address. What this does is that the host IP address will be automatically written into `docker-compose.yml`.

```bash
# Only Linux users
./setup.sh
```

Change the network name in line 20 of the `docker-compose.yaml` file from `mainnet` to `localhost`, so that the Graph Node connects to the local hardhat node of step 1:

```diff
      ipfs: 'ipfs:5001'
-     ethereum: 'mainnet:http://host.docker.internal:8545'
+     ethereum: 'localhost:http://host.docker.internal:8545'
      GRAPH_LOG: info
```

Now you can start the Graph Node by running:

```bash
docker-compose up
```

This will start an IPFS node, a Postgres database and a Graph Node that you can use locally.

### 3. Initialize and deploy subgraph

Inside this repository and `packages/subgraph` directory run:

```bash
# Creates ephemeral subgraph.yaml from template
yarn manifest local

# Generates AssemblyScript code from manifest
yarn codegen

# Initializes subgraph on local Graph Node
yarn create:local

# Deploys subgraph to local Graph Node
yarn deploy:local
```

### 4. Query the subgraph

If everything was successful, you should be able to query the local subgraph via:

```
http://localhost:8000/subgraphs/name/dohaki/bosoncclocal/graphql
```
