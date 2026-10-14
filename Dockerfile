ARG BUN_VERSION=1.4.2-slim
FROM oven/bun:${BUN_VERSION} AS dependencies
LABEL org.opencontainers.image.source="https://github.com/webTeamChesh/nextjs-c4c"
WORKDIR /app

# Stage 1 - install

# bun.lockb replaces package-lock.json
COPY package.json bun.lockb* .npmrc* ./
RUN bun install --frozen-lockfile

# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================
FROM oven/bun:${BUN_VERSION} AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build


# ============================================
# Stage 3: Run Next.js application
# ============================================
FROM oven/bun:${BUN_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV TZ="Europe/London"
ENV PORT=3001
ENV HOSTNAME=::
ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir .next
RUN chown bun:bun .next

COPY --from=builder --chown=bun:bun /app/public ./public
RUN mkdir .next
RUN chown bun:bun .next

COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static
COPY ./manifest.json /manifest.json

USER bun
EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME=::

CMD ["bun", "server.js"]
