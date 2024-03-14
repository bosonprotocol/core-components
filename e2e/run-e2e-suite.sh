#!/bin/bash

trap cleanup EXIT INT TERM

function cleanup() {
  exit_status=$?
  cd e2e
  docker-compose down -v
  exit "$exit_status"
}

echo "Install protocol and dependencies..."
cd contracts
npm ci
cd ..
cd e2e

docker-compose up -d

echo "Waiting for services..."
sleep 15

echo "Deploying contracts...."
docker compose exec hardhat-node npm run deploy
if [ $? -ne 0 ]; then
  echo "Contracts couldn't be deployed ❌"
  exit 1
fi
echo "Successfully deployed contracts ✅"

echo "Deploying subgraph..."
npm run subgraph:deploy:local
if [ $? -ne 0 ]; then
  echo "Subgraph couldn't be deployed ❌"
  exit 1
fi
echo "Successfully deployed subgraph ✅"

echo "Run e2e tests..."
cd ..
npm run e2e:test -- --no-cache

exit
