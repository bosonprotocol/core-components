FROM node:22
RUN npm install -g npm@11.4.2
RUN apt update
RUN apt install supervisor --yes

WORKDIR /app

COPY ./contracts/*.json ./
RUN mkdir -p ./patches
COPY ./contracts/patches ./patches
RUN mkdir -p ./scripts
COPY ./contracts/scripts ./scripts

RUN npm ci

COPY ./contracts ./

RUN npx hardhat compile

EXPOSE 8545

ENV SUPERVISOR_LOG_LEVEL=debug
RUN mkdir -p ./logs

CMD ["/usr/bin/supervisord", "-c", "/app/supervisord.conf"]
