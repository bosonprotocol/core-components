FROM --platform=linux/amd64 node:20-alpine

RUN apk --no-cache add --virtual .builds-deps build-base python3 git

RUN mkdir -p /home/node/core-components && chown -R node:node /home/node/core-components

USER node:node
WORKDIR /home/node/core-components

COPY --chown=node:node ./*.json ./
COPY --chown=node:node ./e2e/opensea-api-mock ./e2e/opensea-api-mock
COPY --chown=node:node ./packages/common ./packages/common
COPY --chown=node:node ./packages/metadata ./packages/metadata
COPY --chown=node:node ./packages/metadata-storage ./packages/metadata-storage
RUN npm ci
ENV NODE_ENV production
RUN npm run build

WORKDIR /home/node/core-components/e2e/opensea-api-mock
EXPOSE 3334
ENV PORT 3334
ENV CHAIN_ID 31337
ENV ENV_NAME local
ENV OPENSEA_FEE_RECIPIENT 0x1111122222333334444455555666667777788888
ENV OPENSEA_FEE_PERCENTAGE 50
CMD ["npm", "run", "start"]
