# Protocol v2 contracts wrapper

This folder contains a hardhat project which uses the [Boson Protocol Contracts](https://github.com/bosonprotocol/boson-protocol-contracts) as a submodule.
The primary use of this is to easily allow a customized usage of local hardhat node deployments.

## Usage

### Install deps

```bash
npm i
```

### Scripts

#### Run local node

```bash
npm run node
```

#### Deploy contracts

```bash
npm run deploy
```

## Update submodule

In order to update protocol contracts submodule run

```bash
cd protocol-contracts
git checkout <BRANCH | COMMIT_HASH | TAG>

cd ..

git add .
git commit -m "chore: update protocol contracts submodule"
```
