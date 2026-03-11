# GitHub Copilot Instructions

## Pull Request and Commit Title Naming Rules

All pull request titles and commit messages in this repository must follow the
[Conventional Commits](https://www.conventionalcommits.org/) specification. This
is enforced by the `lint-pr.yaml` GitHub Actions workflow using
[`amannn/action-semantic-pull-request@v4`](https://github.com/amannn/action-semantic-pull-request/tree/v4/).

### Format

```
<type>[(<scope>)][!]: <subject>
```

- **`<type>`** — required, must be one of the allowed types listed below.
- **`(<scope>)`** — optional, must be one of the allowed scopes listed below when provided.
- **`!`** — optional, used to indicate a **breaking change**.
- **`<subject>`** — required, a short description of the change. **Must not start with an uppercase letter.**

### Allowed Types

| Type       | Description                                                         |
|------------|---------------------------------------------------------------------|
| `feat`     | A new feature                                                       |
| `fix`      | A bug fix                                                           |
| `docs`     | Documentation only changes                                          |
| `style`    | Changes that do not affect the meaning of the code (formatting etc) |
| `refactor` | A code change that neither fixes a bug nor adds a feature           |
| `perf`     | A code change that improves performance                             |
| `test`     | Adding missing tests or correcting existing tests                   |
| `build`    | Changes that affect the build system or external dependencies       |
| `ci`       | Changes to CI configuration files and scripts                       |
| `chore`    | Other changes that don't modify src or test files                   |
| `revert`   | Reverts a previous commit                                           |

### Allowed Scopes (optional)

When a scope is provided, it must be one of:

- `common`
- `core-sdk`
- `eth-connect-sdk`
- `ethers-sdk`
- `ipfs-storage`
- `subgraph`
- `deps`
- `metadata`
- `react-kit`

### Subject Rules

- Must **not** start with an uppercase letter (e.g. use `add feature` not `Add feature`).
- Should be a concise description in the imperative mood.

### Breaking Changes

Use the `!` suffix after the type (and optional scope) to signal a breaking change:

```
feat!: drop support for Node 14
feat(core-sdk)!: change return type of createOffer
```

### Single-Commit PRs

When a pull request contains only a single commit, the commit title must also
comply with the Conventional Commits format above (it is validated alongside
the PR title).

### Valid Examples

```
feat: add support for new offer type
fix(core-sdk): resolve incorrect price calculation
docs: update README with new SDK usage
chore(deps): bump ethers to v6
refactor(react-kit): simplify checkout flow
feat(ethers-sdk)!: remove deprecated createVoucher method
```

### Invalid Examples

```
Add new feature          ← missing type
feat: Add new feature    ← subject starts with uppercase 'A'
feature: add new thing   ← 'feature' is not an allowed type
feat(ui): add button     ← 'ui' is not an allowed scope
```
