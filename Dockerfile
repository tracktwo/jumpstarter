FROM node:6-alpine
RUN mkdir -p /usr/src/jumpstarter

WORKDIR /usr/src/jumpstarter

COPY package.json /usr/src/jumpstarter

RUN npm install --production

COPY . /usr/src/jumpstarter

EXPOSE 3001

CMD [ "npm", "start" ]

