FROM node:18-alpine

RUN npm install

EXPOSE 3000

CMD npm run start