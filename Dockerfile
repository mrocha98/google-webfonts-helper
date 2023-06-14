### -----------------------
# References:
# - <https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/>
# - <https://medium.com/@alpercitak/nest-js-use-pnpm-on-docker-81998ab4d8a1>
### -----------------------
FROM node:18.16.0-bullseye-slim AS base

RUN apt update && apt install -y --no-install-recommends \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*
RUN npm i -g pnpm@~8.6.2

FROM base as build-step

WORKDIR /usr/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build
RUN pnpm prune --prod

FROM node:18.16.0-bullseye-slim AS production

USER node
WORKDIR /usr/app

COPY --from=base /usr/bin/dumb-init /usr/bin/dumb-init
COPY --chown=node:node --from=build-step /usr/app/node_modules /usr/app/node_modules
COPY --chown=node:node --from=build-step /usr/app/dist /usr/app/dist

ENV NODE_ENV=production

EXPOSE 8080
CMD ["dumb-init", "node", "/usr/app/dist/app.js"]
