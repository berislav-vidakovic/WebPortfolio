# Stage 1: Build Node dependencies
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy TAS Manager backend files
COPY package*.json ./
RUN npm install

# Copy TAS project folder
COPY TAS/ ./TAS/
RUN cd TAS && npm install && npx playwright install --with-deps chromium


# Copy remaining files
COPY . .

# Expose port for Express TAS Manager
EXPOSE 4000

# Start the Express TAS Manager
CMD ["node", "server.js"]
