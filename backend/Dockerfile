FROM node:14.17.6-alpine

RUN mkdir -p /app/backend

WORKDIR /app/backend

COPY package.json /app/backend

COPY package-lock.json /app/backend

RUN npm install

COPY . /app/backend

CMD ["npm", "start:backend"]