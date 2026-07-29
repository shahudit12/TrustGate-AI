# ─────────────────────────────────────────────────────────────────────────────
# TrustGate AI Frontend — Multi-Stage Dockerfile
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Dependencies ──────────────────────────────────────────────────────
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Development ───────────────────────────────────────────────────────
FROM dependencies AS development

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ── Stage 3: Build ────────────────────────────────────────────────────────────
FROM dependencies AS builder

COPY . .

RUN npm run build

# ── Stage 4: Production (nginx) ────────────────────────────────────────────────
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
