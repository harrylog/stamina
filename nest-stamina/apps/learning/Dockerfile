FROM node:22-alpine As development

WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build learning

CMD ["npm", "run", "start:learning:dev"]