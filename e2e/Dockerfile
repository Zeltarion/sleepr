FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i -g pnpm

RUN npm install -g wait-on

RUN pnpm install

CMD ["pnpm", "test"]