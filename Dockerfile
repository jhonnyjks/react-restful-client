# Dockerfile para produção do client com Node 14.7.0
FROM node:14.7.0-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
