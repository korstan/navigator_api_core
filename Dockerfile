FROM node:15.1.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run dev