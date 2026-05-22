# Frontend: React app served via Node dev server
FROM node:16-alpine

WORKDIR /app

# Accept the API URL at build time (baked into the React bundle)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

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
