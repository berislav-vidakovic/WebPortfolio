# Use the official Playwright image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.55.0-jammy

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Optional: set environment variables inside container (for local testing)
# ENV TESTING_CHATAPP_URL=http://localhost:5173
# ENV TESTING_HELLOWORLD_URL=http://localhost:5000

# Command to run your Playwright tests in headless mode
#CMD ["npx", "playwright", "test"]
CMD ["npx", "playwright", "test", "TestChatApp.spec.js"]
#CMD ["npx", "playwright", "test", "TestHelloWorld.spec.js"]


