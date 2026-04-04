# 1. Choose base image with Node.js
FROM node:18-alpine

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package files first (for layer caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy application source code
COPY . .

# 6. Expose the port your app runs on
EXPOSE 5000

# 7. Define command to start your application
CMD ["node", "server.js"]
