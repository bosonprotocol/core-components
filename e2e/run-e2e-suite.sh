#!/bin/bash

trap cleanup EXIT INT TERM

function cleanup() {
  exit_status=$?
  cd e2e
  docker-compose down -v
  exit "$exit_status"
}

cd e2e

docker-compose up -d

echo "Waiting for services..."
sleep 15

echo "Deploying contracts...."
docker compose exec hardhat-node npm run deploy
echo "Successfully deployed contracts ✅"

echo "Deploying subgraph..."
npm run subgraph:deploy:local
echo "Successfully deployed subgraph ✅"

echo "Run e2e tests..."
cd ..
npm run e2e:test

exit
