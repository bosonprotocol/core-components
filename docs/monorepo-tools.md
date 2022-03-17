[Core components docs](./README.md) | [Local development](./local-development.md)

# Monorepo tools

This project is structured as a monorepo and uses [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces), [lerna](https://lerna.js.org/) and [turborepo](https://turborepo.org/).

All of the mentioned tools aim to optimize the workflow around managing monorepos and therefore have some feature overlap.
Some tools are better than others at certain tasks which is why we use:

- [npm workspaces](#npm-workspaces) for dependency management and linking
- [lerna](#lerna) for automatic versioning
- [turborepo](#turborepo) for task running, such as build, lint and test

## npm workspaces

In general, [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) are a set of tools to manage multiple packages from the project root.
We mainly use it to handle automatic linking of packages in the `<PROJECT>/packages/*` folder via `npm install`.
Other commands that we use are:

### Create a new workspace

```bash
npm init -w ./packages/<WORKSPACE_FOLDER_NAME>

# example
npm init -w ./packages/utils
```

### Add a dependency

```bash
npm install <DEPENDENCY> -w <WORKSPACE_PACKAGE_NAME>

# example
npm install lodash -w @bosonprotocol/core-sdk
```

## Lerna

[Lerna](https://lerna.js.org/) is another tool that optimizes the workflow in a monorepo.
We mainly use it for automatic versioning of our packages.
Have a look into the `.github/workflows/publish-release.yaml` to understand how we use commands like [`lerna publish`](https://github.com/lerna/lerna/tree/main/commands/publish#readme) and [`lerna version`](https://github.com/lerna/lerna/tree/main/commands/version#readme).

In a nutshell, lerna is able to determine which packages changed since the last release.
It also parses the commit messages ([squashed PR titles](./pull-requests.md)) that conform to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec to determine how to bump the versions semantically.
The respective packages are then published to npm and GitHub releases.

## Turborepo

[Turborepo](https://turborepo.org/docs) makes tasks like building, linting and testing in a monorepo more flexible and efficient.
Have a look into the [`package.json`](/package.json) of the root to see for which scripts we use the command `turbo`.
