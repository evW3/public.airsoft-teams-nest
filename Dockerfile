FROM node:16-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY ./dist ./dist
#CMD ['npm', 'run', 'migrate-prod']
#CMD ['npm', 'run', 'start:prod']