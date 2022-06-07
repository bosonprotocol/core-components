#!/bin/sh

cd /app/docker

./deploy.sh &
./start-node.sh
