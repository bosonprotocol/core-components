FROM node:18.9-slim

RUN apt-get -y update
RUN apt-get -y install git

WORKDIR /opt/core-components

COPY --chown=node:node ./**.json ./
COPY --chown=node:node ./examples/meta-tx-gateway ./examples/meta-tx-gateway
COPY --chown=node:node ./packages/common ./packages/common
COPY --chown=node:node ./packages/metadata ./packages/metadata
RUN npm ci --include=dev
ENV NODE_ENV production
RUN npm run build

WORKDIR /opt/core-components/examples/meta-tx-gateway
USER node
EXPOSE 8888
ENV PORT 8888
CMD ["npm", "run", "start"]
