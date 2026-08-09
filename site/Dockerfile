# Build context is the repository root, not site/: the site aliases `@facile/muse` straight at
# ../src/lib so it is built with the exact library source of the commit being deployed. A
# context of site/ alone produces a build that cannot resolve a single component.
FROM oven/bun:1.3-alpine AS build
WORKDIR /repo

COPY site/package.json site/
RUN cd site && bun install

COPY src ./src
COPY site ./site
RUN cd site && bun run build

FROM nginx:1.27-alpine
COPY site/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/site/build /usr/share/nginx/html
EXPOSE 80
