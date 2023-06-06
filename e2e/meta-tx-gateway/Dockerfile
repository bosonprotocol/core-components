FROM node:16-alpine

RUN apk --no-cache add --virtual .builds-deps build-base python3 git

RUN mkdir -p /home/node/core-components && chown -R node:node /home/node/core-components

USER node:node
WORKDIR /home/node/core-components

COPY --chown=node:node ./*.json ./
COPY --chown=node:node ./e2e/meta-tx-gateway ./e2e/meta-tx-gateway
COPY --chown=node:node ./packages/common ./packages/common
COPY --chown=node:node ./packages/metadata ./packages/metadata
RUN npm ci
ENV NODE_ENV production
RUN npm run build

WORKDIR /home/node/core-components/e2e/meta-tx-gateway
EXPOSE 8888
ENV PORT 8888
CMD ["npm", "run", "start"]
