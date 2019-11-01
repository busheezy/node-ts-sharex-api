FROM node:13.0.1-alpine
WORKDIR /app
ARG buildDeps='python make g++'
RUN apk update \
    && apk add $buildDeps

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn build

RUN apk del $buildDeps \
    && rm -rf /var/cache/apk/*

EXPOSE 3000
CMD [ "yarn", "run", "docker:start" ]
