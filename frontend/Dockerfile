# Frontend: React app served via Node dev server
# (For production, you'd build static files + serve via nginx — see comments below)
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files first for layer caching
COPY frontend/package.json frontend/package-lock.json /app/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend source
COPY frontend/ /app/

# Expose React dev server port
EXPOSE 3000

# Bind to 0.0.0.0 so the container is reachable externally
ENV HOST=0.0.0.0

# Start the dev server
CMD ["npm", "start"]

# === PRODUCTION ALTERNATIVE (multi-stage) ===
# For a production-grade image, you'd use a two-stage build:
#   Stage 1 (builder): npm run build → static files in /app/build
#   Stage 2 (nginx):   copy /app/build to /usr/share/nginx/html
# This produces a ~30MB image vs ~500MB for the dev server.
