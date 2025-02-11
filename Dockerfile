FROM node:20.17.0 AS builder
ARG APP
ENV APP=$APP
WORKDIR /app
COPY . .
RUN npm i -g pnpm@9.7.1 && \
    pnpm i --frozen-lockfile && \
    pnpm run build && \
    pnpm run cleanup:node_modules && \
    pnpm i --production --frozen-lockfile

FROM node:20.17.0-alpine AS run
ARG APP
ENV APP=$APP
WORKDIR /app
RUN npm i -g pnpm@9.7.1 && \
    apk --no-cache add \
    curl gcompat zstd && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app .
EXPOSE 3000
CMD ["pnpm", "start"]
