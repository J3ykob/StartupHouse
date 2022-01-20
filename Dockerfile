FROM node:14.15-alpine

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

RUN mkdir ./src
COPY ./dist/src ./src

CMD ["node", "./src/server.js"]