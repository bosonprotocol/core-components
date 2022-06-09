FROM node:16

COPY . /app

WORKDIR /app

RUN npm ci

RUN npx hardhat compile

EXPOSE 8545

CMD [ "npm", "run", "node" ]
