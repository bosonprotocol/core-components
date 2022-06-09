#!/bin/bash

trap cleanup EXIT INT TERM

function cleanup() {
  docker-compose down -v
  rm -rf ./data
  exit
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

echo "Press any key to shutdown services"
read response
