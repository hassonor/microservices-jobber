# Builder Stage
FROM node:21-alpine3.18 AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json tsconfig.json ./

RUN npm ci

# Copy source code and build
COPY src ./src
RUN npm run build

# Prune dev dependencies to prepare for production
RUN npm prune --production

# Final Runtime Stage
FROM node:21-alpine3.18

WORKDIR /app

# Install runtime tools globally
RUN npm install -g pm2 cross-env pino-pretty

# Copy dependencies and build artifacts from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY package*.json ./

# Expose the application port
EXPOSE 4005

# Set the default command
CMD ["npm", "run", "start"]
