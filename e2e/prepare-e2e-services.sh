#!/bin/bash

trap cleanup EXIT INT TERM

function cleanup() {
  docker compose logs
  docker compose down -v
  rm -rf ./data
  exit
}

cd e2e

docker compose pull # force pulling the latest update
docker compose up -d #--build

echo "Waiting for services..."
sleep 15

echo "Waiting for contracts to be deployed..."
docker compose exec boson-protocol-node ls /app/deploy.done
while [ $? -ne 0 ]; do
  sleep 15
  echo "Waiting for contracts to be deployed..."
  docker compose exec boson-protocol-node ls /app/deploy.done
done
echo "Successfully deployed contracts ✅"
echo "Waiting for subgraph to be deployed..."
docker compose exec boson-subgraph ls /home/deploy.done
while [ $? -ne 0 ]; do
  sleep 15
  echo "Waiting for subgraph to be deployed..."
  docker compose exec boson-subgraph ls /home/deploy.done
done
echo "Successfully deployed subgraph ✅"
