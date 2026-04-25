# Claude Code Instructions

## Project Overview

This is the **Boson Protocol core-components** monorepo — a TypeScript SDK and tooling suite for building on top of the [Boson Protocol](https://bosonprotocol.io), a decentralised commerce protocol on Ethereum-compatible chains.

The monorepo is managed with **Lerna** (independent versioning), **npm workspaces**, and **Turborepo** for task orchestration. All packages are under `packages/`, output dual ESM + CJS builds via TypeScript, and are tested with Jest.

## Directory Map

```
packages/          ← Primary source code — start here for almost all tasks
  common/          ← @bosonprotocol/common         — shared types, ABIs, interfaces, utilities
  core-sdk/        ← @bosonprotocol/core-sdk        — main SDK (contracts + subgraph interactions)
  ethers-sdk/      ← @bosonprotocol/ethers-sdk      — ethers.js Web3LibAdapter implementation
  eth-connect-sdk/ ← @bosonprotocol/eth-connect-sdk — eth-connect Web3LibAdapter implementation
  ipfs-storage/    ← @bosonprotocol/ipfs-storage    — IPFS metadata storage implementation
  metadata/        ← @bosonprotocol/metadata        — offer metadata schemas, types, validators
  metadata-storage/← @bosonprotocol/metadata-storage— metadata storage interface definitions
  react-kit/       ← @bosonprotocol/react-kit       — React components and hooks
  subgraph/        ← @bosonprotocol/subgraph        — The Graph subgraph (indexing protocol data)

scripts/           ← One-off TypeScript utility scripts (ts-node); not published packages
e2e/               ← End-to-end test suite (Jest, Docker services)
data/              ← Static data: metadata templates, exchange policy rules
docs/              ← Developer documentation (Markdown)

contracts/         ← ⚠️  GIT SUBMODULE — see warning below
```

## ⚠️ contracts/ Is a Git Submodule — Avoid Unless Explicitly Needed

`contracts/` is a **separate Git submodule** (`bosonprotocol/boson-protocol-contracts`) containing the Solidity smart contracts, Hardhat configuration, deployment scripts, and contract artifacts.

**Do not explore or read files inside `contracts/` unless the task explicitly requires inspecting smart contract source code.**

Reasons to stay out of `contracts/`:
- It is not part of day-to-day SDK or UI development.
- Its content is managed independently and is very large.
- Contract ABIs consumed by the SDK are already exported as JSON into `packages/common/src/abis/` — use those instead.

**Only enter `contracts/` when you need to:**
- Read Solidity source files (`.sol`)
- Inspect Hardhat configuration or deployment scripts inside `contracts/`
- Investigate a contract-level bug that cannot be understood from the ABI alone

## Key Conventions

- **Language**: TypeScript everywhere (strict mode via `tsconfig.base.json`)
- **Build**: `npm run build` (Turborepo runs `tsc` + CJS build per package)
- **Test**: `npm run test` (Jest, per-package configs)
- **Lint**: ESLint + Prettier; `npm run lint:fix` auto-fixes issues
- **Versioning**: Lerna independent (`lerna.json`); Conventional Commits enforced on PRs
- **Commit/PR titles**: must follow Conventional Commits (see `.github/copilot-instructions.md`)

## Post-task linting

After completing any task (once code and test changes have been functionally validated), always run:

```bash
npm run lint:fix
```

This fixes linting issues introduced by the changes before considering the task done.

Run it **without a `cd &&` prefix** — use `npm run lint:fix` directly so it matches the `Bash(npm:*)` allow rule and does not prompt for authorisation.
