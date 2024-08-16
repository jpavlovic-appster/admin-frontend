## --------- for development ---------
FROM node:14.20.0-alpine AS developmet

# install dependecies
RUN apk update
RUN apk add --no-cache git build-base gcc abuild make bash python3 postgresql-client

RUN mkdir -p /home/node/app && chown node:node /home/node/app

USER node

WORKDIR /home/node/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run

# set DEBIAN_FRONTEND to noninteractive.
ENV DEBIAN_FRONTEND noninteractive

# default to port 80 for node, and 9229 and 9230 (tests) for debug
ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT 9240 9241

# install dependencies first, in a different location for easier app bind mounting for local development

COPY package*.json ./
RUN npm install --force && npm install --only=dev --force

# copy in our source code last, as it changes the most
COPY . .

## --------- for production build ---------
FROM developmet AS prod-builder

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN GENERATE_SOURCEMAP=false && npm run build

## --------- for staging deployment ---------
FROM nginx:stable AS staging

EXPOSE 80

COPY --from=prod-builder /home/node/app/build /usr/share/nginx/html

COPY --from=prod-builder /home/node/app/nginx.conf /etc/nginx/conf.d/default.conf

## --------- for production deployment ---------
FROM nginx:stable AS production

EXPOSE 80

COPY --from=prod-builder /home/node/app/build /usr/share/nginx/html

COPY --from=prod-builder /home/node/app/nginx.conf /etc/nginx/conf.d/default.conf
