#!/bin/bash

trap cleanup EXIT INT TERM

function cleanup() {
  exit_status=$?
  cd e2e
  docker compose logs
  docker compose down -v
  exit "$exit_status"
}

. ./e2e/prepare-e2e-services.sh

echo "Run e2e tests..."
cd ..
npm run e2e:test -- --no-cache

exit
