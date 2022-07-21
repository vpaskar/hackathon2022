FROM node:12.18.1

WORKDIR /app

COPY . .

RUN npm install --production

EXPOSE 3000

CMD [ "npm", "start" ]
