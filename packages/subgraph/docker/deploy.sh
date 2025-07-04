rm ../../deploy.done
echo "Wait for the graph-node server to be ready..."
curl http://localhost:8000
while [ $? -ne 0 ]; do
  sleep 2
    echo "Wait for the graph-node server to be ready..."
    curl http://localhost:8000
done
echo "Deploy subgraph..."

npm run manifest:local
npm run create:local
npx graph deploy --node http://localhost:8020/ --ipfs http://host.docker.internal:5001 boson/corecomponents -l 0.0.1
touch ../../deploy.done
