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

# Brief delay to allow GitHub to queue workflow runs triggered by the push
sleep 10

# Find workflow runs that require manual approval for this branch.
# Only consider allowlisted CI workflows and safe event types.
RUN_IDS=$(gh run list \
  --branch "$BRANCH" \
  --status "action_required" \
  --json "databaseId,workflowName,event" \
  --jq '.[] | select((.event == "pull_request" or .event == "push") and (.workflowName == "CI" or .workflowName == "Lint PR")) | .databaseId' 2>/dev/null || true)

if [ -z "$RUN_IDS" ]; then
  echo "No allowlisted CI workflow runs require approval for branch: $BRANCH"
  exit 0
fi

echo "Found workflow runs requiring approval on branch '$BRANCH':"
echo "$RUN_IDS"

# Approve each pending workflow run
while IFS= read -r RUN_ID; do
  if [ -n "$RUN_ID" ]; then
    echo "Approving workflow run: $RUN_ID"
    if gh run approve "$RUN_ID"; then
      echo "Successfully approved run: $RUN_ID"
    else
      echo "Failed to approve run: $RUN_ID (continuing)"
    fi
  fi
done <<< "$RUN_IDS"

echo "Done processing workflow approvals for branch: $BRANCH"
