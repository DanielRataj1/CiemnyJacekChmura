FROM node:22-lts
WORKDIR /script
COPY . .
RUN npm install
EXPOSE 8080
CMD {"node", "script.js"}