# Setup Local Environment for the Boson Protocol Core Components

The local environment is running a set of docker containers to build up a complete running environment for Boson Protocol and the Core Components.

## Prerequisites

The local environment requires:
- npm / node version >= 16
- git
- Docker Desktop running. See https://www.docker.com/get-started/

## Clone, install and build core-components repository
```shell
git clone https://github.com/bosonprotocol/core-components
```
```shell
cd core-components
```
```shell
npm ci
```
```shell
npm run build
```

## Startup the environment

Ensure Docker Desktop is started on the machine to continue.
```shell
npm run e2e:services
```
This starts several containers (local blockchain, IPFS and subgraph node) working all together to create a test environment.

After a few minutes, the environment is launched and operational. You should leave the console open and press Enter when you want to stop it. If you quit the console without shuttong down the container, you'll have to delete them manually, using Docker Desktop or docker CLI, before trying to relaunch the environment again.

Note: every time the environment is stopped and restarted will clean all actions realized previously on the blockchain and IPFS resources.

## Environment configuration

Configuration of the Local Environment is matching [this one](../../packages/common/src/configs.ts#L11), predefined in the Common package and used to initialize the CoreSDK.

The blockchain is local; started with *hardhat node*

- the RPC node URL is: http://127.0.0.1:8545
- the chainId: 31337
- with this [list of accounts](../../contracts/accounts.js).

You should define this network in Metamask and import some of these accounts if you want to play with this local environment from your browser.

## Play with Boson Protocol Core Components in the local environment

Leave the console open and start another one in the same directory (eg  core-components).

Choose your account (in [accounts.js](../../contracts/accounts.js)) and save the private key in an env var (eg PRIVATE_KEY)

### Create a Seller

Run the following command to create a seller for the wallet defined by the PRIVATE_KEY env var:
```shell
npm run create-seller -– $PRIVATE_KEY -–env local -–configId local-31337-0
```
Note the sellerId of the seller you’ve just created (eg “Seller with id 2 created”)

Explore the subgraph entities: http://127.0.0.1:8000/subgraphs/name/boson/corecomponents/graphql?query=query+MyQuery+%7B%0A++sellers+%7B%0A++++id%0A++++admin%0A++++assistant%0A++++contractURI%0A++++metadataUri%0A++++royaltyPercentage%0A++++sellerId%0A++++treasury%0A++++voucherCloneAddress%0A++%7D%0A++disputeResolvers+%7B%0A++++id%0A++%7D%0A++offers+%7B%0A++++id%0A++%7D%0A++exchanges+%7B%0A++++id%0A++%7D%0A%7D 

You should see the existing seller you’ve just created and some of their properties.

### Create an offer

#### Publishing offer metadata on IPFS

Before creating an offer, you need to publish its metadata on IPFS (here it’s a local IPFS node). The metadata also includes images that needs to be published as well.

```shell
npm run ipfs-upload -- scripts/assets/small1.png --env local --configId local-31337-0
```
```shell
npm run ipfs-upload -- scripts/assets/small2.png --env local --configId local-31337-0
```
```shell
npm run ipfs-upload -- scripts/assets/small3.png --env local --configId local-31337-0
```
```shell
npm run ipfs-upload -- scripts/assets/offer_1.metadata.json --env local --configId local-31337-0
```

#### Create the offer on chain

The following command will create an offer in Boson Protocol on the local blockchain, using the metadata published on IPFS at the previous step.

***Important**: the IPFS metadata should be published BEFORE the offer is created on chain. This will allow the Subgraph to read the offer metadata when trigerred by the on-chain CreatedOffer event.*

```shell
npm run create-offer -- %PRIVATE_KEY% ./scripts/assets/offer_1.onchain.json --env local --configId local-31337-0
```
Explore the subgraph to check the offer is created: http://127.0.0.1:8000/subgraphs/name/boson/corecomponents/graphql?query=query+MyQuery+%7B%0A++offers+%7B%0A++++id%0A++++sellerId%0A++++price%0A++++metadata+%7B%0A++++++description%0A++++++name%0A++++%7D%0A++++numberOfCommits%0A++++quantityAvailable%0A++++validUntilDate%0A++++voucherRedeemableUntilDate%0A++++metadataUri%0A++%7D%0A++exchanges+%7B%0A++++id%0A++%7D%0A%7D&operationName=MyQuery


## Play with the BOSON dApp in the local environment

```shell
git clone https://github.com/bosonprotocol/interface
```
```shell
cd interface
```
```shell
npm ci
```
create a local *./.env* file with the following content:

    REACT_APP_ENV_NAME=local
    REACT_APP_WIDGETS_URL=http://localhost:3000
    REACT_APP_ENABLE_CURATION_LISTS=false
    REACT_APP_RNFT_LICENSE_TEMPLATE=ipfs://QmUxAXqM6smDYj7TvS9oDe5kRoAVmkqcyWCKEeNsD6JA97
    REACT_APP_BUYER_SELLER_AGREEMENT_TEMPLATE=ipfs://QmQ8ZTmmRV15rFaWG9KRyjFRrpaD1o2sDwZoYiWgBaAto6
    REACT_APP_DEFAULT_DISPUTE_RESOLVER_ID=1
    REACT_APP_DEFAULT_RESOLUTION_PERIOD_DAYS=15
    REACT_APP_ENABLE_CURATION_LISTS=false
    REACT_APP_GOOGLE_TAG_ID="GTM-ID"
    REACT_APP_VIEW_MODE=dapp
    REACT_APP_FAIR_EXCHANGE_POLICY_RULES=ipfs://QmV3Wy2wmrFdEXzhyhvvaW25Q8w2wTd2UypFVyhwsdBE8T
    REACT_APP_DAPP_VIEW_MODE=same_origin
    REACT_APP_DR_CENTER_VIEW_MODE=same_origin
    REACT_APP_UNISWAP_API_URL="https://api.uniswap.org/v2"
    REACT_APP_AWS_API_ENDPOINT="https://api.uniswap.org/v1/graphql"
    REACT_APP_INFURA_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

```shell
npm run dev
```
Connect Metamask on the local network (RPC node: http://127.0.0.1:8545, chainId: 31337) and import the account used to create the seller (chosen from [accounts.js](https://github.com/bosonprotocol/core-components/blob/main/contracts/accounts.js)).

You should now be able to connect to the dApp as the seller (for instance create new offers through the UI).

You can import other accounts to act as buyers and commit to offers, redeem exchanges, etc.


