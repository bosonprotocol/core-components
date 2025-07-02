#!/bin/bash
rm deploy.done

# Start the deployment process
npm run deploy

touch deploy.done