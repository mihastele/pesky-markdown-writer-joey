# Pesky Markdown Writer — Nuxt Dev Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files for layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose Nuxt dev server port
EXPOSE 3000

# Start Nuxt dev server with host binding for Docker
CMD ["npx", "nuxt", "dev", "--host", "0.0.0.0"]
