FROM node:6.6

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /code/

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ['npm', 'start']
