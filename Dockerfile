FROM node:6.4

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /code/

COPY package.json .

RUN npm install nodemon -g

RUN npm install

COPY . .

EXPOSE 8000

CMD ['npm', 'start']
