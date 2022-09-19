# `@bosonprotocol/subgraph`

Official subgraph of the Boson Protocol.

| Env          | Network   | Endpoint                                                                                     |
| ------------ | --------- | -------------------------------------------------------------------------------------------- |
| `testing`    | `mumbai` | `https://api.thegraph.com/subgraphs/name/levalleux-ludo/bosontesting` |
| `staging`    | `mumbai`  | `https://thegraph.com/hosted-service/subgraph/levalleux-ludo/bosonmumbai`                              |
| `production` | `polygon` | `TBD`                                                                                        |

## Local development

If you haven't already, run in the root of this monorepo

```bash
npm ci
```

### Unit tests

We use [Matchstick](https://github.com/LimeChain/matchstick/blob/main/README.md) for unit testing the subgraph.

Either run in the root of this monorepo

```bash
npm run test -w @bosonprotocol/subgraph
```

or in the `/packages/subgraph` folder

```bash
npm run test
```
