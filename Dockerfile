FROM node:8.0

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src

WORKDIR /src
ADD app/package.json /src/package.json
RUN npm install

ADD app/nodemon.json /src/nodemon.json

EXPOSE 8000

CMD ['npm', 'dev']
