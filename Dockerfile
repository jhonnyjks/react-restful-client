# Legacy CRA + webpack4: Node 22 needs OpenSSL legacy provider.
# Runtime in prod is nginx static; this image is for local/dev builds.
FROM node:22.23.4-bookworm
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000
CMD ["npm", "start"]