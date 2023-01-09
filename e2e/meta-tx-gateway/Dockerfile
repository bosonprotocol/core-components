FROM node:16-alpine

RUN apk --no-cache add --virtual .builds-deps build-base python3 git

WORKDIR /opt/core-components

COPY --chown=node:node ./**.json ./
COPY --chown=node:node ./e2e/meta-tx-gateway ./e2e/meta-tx-gateway
COPY --chown=node:node ./packages/common ./packages/common
COPY --chown=node:node ./packages/metadata ./packages/metadata
RUN npm ci --include=dev
ENV NODE_ENV production
RUN npm run build

WORKDIR /opt/core-components/e2e/meta-tx-gateway
USER node
EXPOSE 8888
ENV PORT 8888
CMD ["npm", "run", "start"]
