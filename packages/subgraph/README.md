# `@bosonprotocol/subgraph`

Official subgraph of the Boson Protocol.

| Env          | Network   | Endpoint                                                                                     |
| ------------ | --------- | -------------------------------------------------------------------------------------------- |
| `testing`    | `private` | `https://graph.bsn-development-potassium.bosonportal.io/subgraphs/name/boson/corecomponents` |
| `staging`    | `ropsten` | `https://api.thegraph.com/subgraphs/name/dohaki/bosonccropsten`                              |
| `production` | `mainnet` | `TBD`                                                                                        |

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

**Only for Linux users:** Linux does not support the `host.docker.internal` alias for the host machine that The Graph Node Docker Compose uses. Run the following command from the Docker directory to replace the alias with the host IP address. What this does is that the host IP address will be automatically written into `docker-compose.yml`.

In a new terminal clone the Graph Node repository and enter the `docker` directory:

```bash
git clone https://github.com/graphprotocol/graph-node
cd graph-node/docker
```

```bash
# Only Linux users
./setup.sh
```

Change the network name in line 20 of the `docker-compose.yaml` file from `mainnet` to `localhost`, so that the Graph Node connects to the local hardhat node of step 1.
You also need to enable the `ipfsOnEthereum` feature by setting the env var `GRAPH_ALLOW_NON_DETERMINISTIC_IPFS` to `true`.

```diff
      ipfs: 'ipfs:5001'
-     ethereum: 'mainnet:http://host.docker.internal:8545'
+     ethereum: 'localhost:http://host.docker.internal:8545'
      GRAPH_LOG: info
+     GRAPH_ALLOW_NON_DETERMINISTIC_IPFS: true
```

**All the other users:**

Run the docker compose file that's on

```
/core-components/utils/graph/docker-compose.yml
```

```bash
docker-compose up
```

This will start an IPFS node, a Postgres database and a Graph Node that you can use locally.

### 3. Initialize and deploy subgraph

Inside this repository and `packages/subgraph` directory run:

```bash
npm run deploy:local
```

### 4. Query the subgraph

If everything was successful, you should be able to query the local subgraph via:

```
http://localhost:8000/subgraphs/name/dohaki/bosoncclocal/graphql
```
