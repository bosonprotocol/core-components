FROM --platform=linux/amd64 node:20

COPY . /app

WORKDIR /app

RUN npm install -g npm@10.5.2
RUN npm ci

RUN npx hardhat compile

EXPOSE 8545

CMD [ "npm", "run", "node" ]
