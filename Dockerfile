# ---------- Stage 1: Build React app ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build argument for API key (passed from Coolify)
ARG API_KEY
ENV VITE_API_KEY=$API_KEY

# Build the production bundle
RUN npm run build


# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Remove default Nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
