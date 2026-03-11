#!/bin/bash
# Copilot session end hook: approve pending CI workflow runs
# This hook is triggered when a Copilot coding session ends and automatically
# approves any CI workflow runs that are waiting for manual approval.
# This is a workaround for GitHub requiring manual approval for CI workflows
# when Copilot commits to a pull request branch.
# See: https://github.com/orgs/community/discussions/162826

# Get the current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)

if [ -z "$BRANCH" ] || [ "$BRANCH" = "HEAD" ]; then
  echo "Unable to determine current branch, skipping CI trigger"
  exit 0
fi

# Do not auto-approve workflow runs on protected branches
PROTECTED_BRANCHES=("main" "master")
for PROTECTED in "${PROTECTED_BRANCHES[@]}"; do
  if [ "$BRANCH" = "$PROTECTED" ]; then
    echo "Branch '$BRANCH' is protected; skipping workflow auto-approval"
    exit 0
  fi
done

echo "Copilot session ended on branch: $BRANCH"

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
  # Only consider allowlisted CI workflows and safe event types.
  RUN_LIST_OUTPUT=$(gh run list \
    --branch "$BRANCH" \
    --status "action_required" \
    --json "databaseId,workflowName,event" \
    --jq '.[] | select((.event == "pull_request" or .event == "push") and (.workflowName == "CI" or .workflowName == "Lint PR")) | .databaseId' 2>&1)
  GH_RUN_LIST_STATUS=$?

  if [ "$GH_RUN_LIST_STATUS" -ne 0 ]; then
    echo "Error querying workflow runs for branch '$BRANCH':"
    echo "$RUN_LIST_OUTPUT"
    exit 1
  fi

  # Approve any newly found runs (skip ones we already approved)
  while IFS= read -r RUN_ID; do
    if [ -n "$RUN_ID" ] && ! echo "$APPROVED_IDS" | grep -qx "$RUN_ID"; then
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
