# Development Dockerfile for Angular
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 4200
EXPOSE 4200

# Start development server with host 0.0.0.0 to allow external access
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]