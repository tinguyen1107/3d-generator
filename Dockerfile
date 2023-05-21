# Build BASE
FROM alpine:3.16 as BASE

ENV NODE_VERSION 19.9.0

WORKDIR /appp
COPY package.json yarn.lock ./
RUN apk add --no-cache git \
    && yarn install --frozen-lockfile \
    && yarn cache clean

# Build Image
FROM alpine:3.16 as BUILD

ENV NODE_VERSION 19.9.0

WORKDIR /appp
COPY --from=BASE /appp/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline \
    # Follow https://github.com/ductnn/Dockerfile/blob/master/nodejs/node/16/alpine/Dockerfile
    && node-prune


# Build production
FROM alpine:3.16 as PRODUCTION

ENV NODE_VERSION 19.9.0

WORKDIR /appp

COPY --from=BUILD /appp/package.json /appp/yarn.lock ./
COPY --from=BUILD /appp/node_modules ./node_modules
COPY --from=BUILD /appp/.next ./.next
COPY --from=BUILD /appp/public ./public
# COPY --from=BUILD /appp/next.config.js ./

EXPOSE 3000

CMD ["yarn", "start"]
