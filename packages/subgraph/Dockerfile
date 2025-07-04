FROM graphprotocol/graph-node:v0.33.0

RUN apt-get update
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs
RUN apt-get install -y supervisor

WORKDIR /home

COPY ./*.json ./
RUN mkdir -p ./packages/common
RUN mkdir -p ./packages/metadata
RUN mkdir -p ./packages/metadata-storage
RUN mkdir -p ./packages/subgraph
COPY ./*.json ./
COPY ./packages/common/*.json ./packages/common/
COPY ./packages/metadata/*.json ./packages/metadata/
COPY ./packages/metadata-storage/*.json ./packages/metadata-storage/
COPY ./packages/subgraph/*.json ./packages/subgraph/

RUN npm ci

COPY ./packages/common ./packages/common
COPY ./packages/metadata ./packages/metadata
COPY ./packages/metadata-storage ./packages/metadata-storage
COPY ./packages/subgraph ./packages/subgraph

RUN npm run build

WORKDIR /home/packages/subgraph
RUN npm run manifest:local

WORKDIR /

ENV SUPERVISOR_LOG_LEVEL debug

CMD ["/usr/bin/supervisord", "-c", "/home/packages/subgraph/docker/supervisord.conf"]
