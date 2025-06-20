# Dockerfile para ambiente de desenvolvimento React
FROM node:14

WORKDIR /app

COPY package.json package-lock.json* ./
COPY .env.development.example .env.development
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000
CMD ["npm", "start"]