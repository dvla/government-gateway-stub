FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 9090

ENV DEBUG oidc-provider* 

CMD ["node", "index.js"]