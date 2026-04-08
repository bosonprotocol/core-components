# Claude Code Instructions

## Post-task linting

After completing any task (once code and test changes have been functionally validated), always run:

```bash
npm run lint:fix
```

This fixes linting issues introduced by the changes before considering the task done.

Run it **without a `cd &&` prefix** — use `npm run lint:fix` directly so it matches the `Bash(npm:*)` allow rule and does not prompt for authorisation.
