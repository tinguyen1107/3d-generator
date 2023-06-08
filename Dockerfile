FROM node:16-alpine as BASE
LABEL author="tinguyen"

WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add --no-cache git \
    && yarn --frozen-lockfile \
    && yarn cache clean

# Build Image
FROM node:16-alpine as BUILD
LABEL author="tinguyen"

WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && yarn build \
    && cd .next/standalone \
    && curl -sf https://gobinaries.com/tj/node-prune | sh


# Build production
FROM node:16-alpine AS PRODUCTION
LABEL author="tinguyen"

WORKDIR /app
COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./

# Set mode "standalone" in file "next.config.js"
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static


EXPOSE 3000

CMD ["node", "server.js"]

