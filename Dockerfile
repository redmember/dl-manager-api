FROM node:8

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install
RUN npm install -g apidoc

COPY ./src ./src
COPY ./gulpfile.js .
COPY ./doc ./doc
COPY ./config ./config

EXPOSE 3005
CMD [ "npm", "start" ]
