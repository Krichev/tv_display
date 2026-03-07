# ============================================================================
# Stage 1: Build the Vite React app
# ============================================================================ 
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .

# Vite env vars (baked at build time)
# With Nginx proxy, these should be relative paths
ARG VITE_API_URL=/api
ARG VITE_WS_URL=/ws-game
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WS_URL=${VITE_WS_URL}

RUN npm run build

# ============================================================================ 
# Stage 2: Serve with Nginx
# ============================================================================ 
FROM nginx:stable-alpine AS runtime

# Install envsubst (part of gettext)
RUN apk add --no-cache gettext

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config template and entrypoint
COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh

# Ensure entrypoint is executable
RUN chmod +x /docker-entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/health || exit 1

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
