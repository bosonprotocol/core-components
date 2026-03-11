#!/bin/bash
# Copilot session end hook: approve pending CI workflow runs
# This hook is triggered when a Copilot coding session ends and automatically
# approves any CI workflow runs that are waiting for manual approval.
# This is a workaround for GitHub requiring manual approval for CI workflows
# when Copilot commits to a pull request branch.
# See: https://github.com/orgs/community/discussions/162826

# This hook is best-effort: any failure must exit 0 so the overall session-end
# step is not marked as failed. All error paths below exit 0 explicitly.

# GitHub username of the Copilot coding agent bot
COPILOT_BOT_ACTOR="copilot[bot]"

# Get the current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)

if [ -z "$BRANCH" ] || [ "$BRANCH" = "HEAD" ]; then
  echo "Unable to determine current branch, skipping CI trigger"
  exit 0
fi

# Only auto-approve workflow runs on Copilot-managed branches (branch name must start with "copilot/")
if [[ "$BRANCH" != copilot/* ]]; then
  echo "Branch '$BRANCH' is not a Copilot branch (must start with 'copilot/'); skipping workflow auto-approval"
  exit 0
fi

# Detect the repository default branch (fail-safe: default to "main")
DEFAULT_BRANCH=$(git remote show origin 2>/dev/null | awk '/HEAD branch/ {print $NF}')
if [ -z "$DEFAULT_BRANCH" ]; then
  DEFAULT_BRANCH="main"
fi

echo "Copilot session ended on branch: $BRANCH"

# Do not auto-approve if the branch contains any changes to the .github directory.
# Workflow file changes must be reviewed by a maintainer before CI runs are approved.
# Fail closed: if the diff cannot be computed, skip auto-approval for safety.
GITHUB_DIR_DIFF_OUTPUT=$(git diff --name-only "origin/${DEFAULT_BRANCH}...HEAD" -- '.github/' 2>&1)
GITHUB_DIR_DIFF_STATUS=$?
if [ "$GITHUB_DIR_DIFF_STATUS" -ne 0 ]; then
  echo "Unable to check .github/ changes (git diff failed); skipping workflow auto-approval for safety"
  echo "$GITHUB_DIR_DIFF_OUTPUT"
  exit 0
fi
if [ -n "$GITHUB_DIR_DIFF_OUTPUT" ]; then
  echo "Branch '$BRANCH' contains changes to .github/; skipping workflow auto-approval for security"
  echo "Changed files:"
  echo "$GITHUB_DIR_DIFF_OUTPUT"
  exit 0
fi

# Ensure GitHub CLI is available before attempting to query workflow runs
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is not installed; skipping CI workflow approval for branch: $BRANCH"
  exit 0
fi

# Poll for workflow runs requiring approval for a bounded period.
# This handles queue delays and API lag where runs may enter action_required
# some seconds after the push.
POLL_INTERVAL=10
POLL_MAX=120
POLL_ELAPSED=0
APPROVED_IDS=""

while [ "$POLL_ELAPSED" -lt "$POLL_MAX" ]; do
  # Find workflow runs that require manual approval for this branch.
  # Only consider allowlisted CI workflows, safe event types, and runs
  # triggered by the Copilot bot to avoid auto-approving untrusted code.
  # Capture stdout and stderr separately so gh warnings don't appear as run IDs.
  _gh_stderr=$(mktemp 2>/dev/null || echo "/tmp/gh_run_list_stderr.$$")
  RUN_LIST_OUTPUT=$(gh run list \
    --branch "$BRANCH" \
    --status "action_required" \
    --json "databaseId,workflowName,event,actor" \
    --jq ".[] | select((.event == \"pull_request\" or .event == \"push\") and (.workflowName == \"CI\" or .workflowName == \"Lint PR\") and .actor.login == \"${COPILOT_BOT_ACTOR}\") | .databaseId" 2>"$_gh_stderr")
  GH_RUN_LIST_STATUS=$?

  if [ "$GH_RUN_LIST_STATUS" -ne 0 ]; then
    echo "Error querying workflow runs for branch '$BRANCH':"
    [ -f "$_gh_stderr" ] && cat "$_gh_stderr"
    rm -f "$_gh_stderr"
    echo "Skipping workflow auto-approval for branch '$BRANCH' due to GitHub CLI/API error"
    exit 0
  fi
  [ -s "$_gh_stderr" ] && echo "gh run list warnings: $(cat "$_gh_stderr")"
  rm -f "$_gh_stderr"

  # Approve any newly found runs (skip ones we already approved).
  # Validate each RUN_ID is numeric to guard against any unexpected non-numeric output.
  while IFS= read -r RUN_ID; do
    if [[ ! "$RUN_ID" =~ ^[0-9]+$ ]]; then
      [ -n "$RUN_ID" ] && echo "Skipping unexpected non-numeric run ID: $RUN_ID"
      continue
    fi
    if ! echo "$APPROVED_IDS" | grep -qx "$RUN_ID"; then
      echo "Approving workflow run: $RUN_ID"
      if gh run approve "$RUN_ID"; then
        echo "Successfully approved run: $RUN_ID"
        APPROVED_IDS="${APPROVED_IDS}${RUN_ID}"$'\n'
      else
        echo "Failed to approve run: $RUN_ID (continuing)"
      fi
    fi
  done <<< "$RUN_LIST_OUTPUT"

  POLL_ELAPSED=$((POLL_ELAPSED + POLL_INTERVAL))
  if [ "$POLL_ELAPSED" -lt "$POLL_MAX" ]; then
    sleep "$POLL_INTERVAL"
  fi
done

if [ -z "$APPROVED_IDS" ]; then
  echo "No allowlisted CI workflow runs required approval for branch: $BRANCH"
else
  echo "Done processing workflow approvals for branch: $BRANCH"
fi

exit 0
