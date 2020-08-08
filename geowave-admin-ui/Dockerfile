FROM node:9 AS base
WORKDIR /work
COPY package.json .
COPY yarn.lock .
RUN set -ex \
	&& yarn install
COPY . .


FROM base AS build
RUN set -ex \
	&& NODE_ENV=production ./scripts/compile.sh --no-progress


FROM nginx
WORKDIR /public
COPY --from=build /work/dist/public/ .
COPY --from=build /work/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
