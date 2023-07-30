FROM node:18.12.1-alpine3.17

WORKDIR /usr/src/app

ADD ./models /usr/src/app/models
ADD ./controllers /usr/src/app/controllers
ADD ./utils /usr/src/app/utils

COPY ./app.js /usr/src/app/
COPY ./index.js /usr/src/app/
COPY ./entrypoint.sh /usr/src/app/

COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install --loglevel verbose

ENTRYPOINT [ "/bin/sh" ]
