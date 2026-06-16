# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy Prisma schema FIRST so postinstall (prisma generate) can find it
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
COPY package*.json ./

# Disable postinstall during npm ci — we'll run prisma generate manually
RUN npm ci --ignore-scripts

# Now run prisma generate manually
RUN npx prisma generate

COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

# Copy production artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/src/index.js"]
