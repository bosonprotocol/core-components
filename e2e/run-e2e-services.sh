#!/bin/bash

trap cleanup EXIT INT TERM

function cleanup() {
  docker compose logs
  docker compose down -v
  rm -rf ./data
  exit
}

. ./e2e/prepare-e2e-services.sh

echo "Press any key to shutdown services"
read response
