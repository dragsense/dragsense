FROM node:16-alpine
WORKDIR /

RUN npm install

EXPOSE 3000

CMD npm run dev