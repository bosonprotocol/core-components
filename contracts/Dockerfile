FROM --platform=linux/amd64 node:20

RUN mkdir -p /app && chown -R node:node /app
COPY ./*.json /app
RUN mkdir -p /app/scripts
COPY ./scripts/postinstall.js /app/scripts

WORKDIR /app

RUN npm install -g npm@10.5.2
RUN npm ci
COPY . /app
RUN npx hardhat compile

EXPOSE 8545

CMD [ "npm", "run", "node" ]
