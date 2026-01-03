FROM node:18-alpine

# 👇 instala git (ESSENCIAL)
RUN apk add --no-cache git

WORKDIR /app

COPY package.json ./
RUN npm install

COPY index.js .

EXPOSE 3000
CMD ["node", "index.js"]
