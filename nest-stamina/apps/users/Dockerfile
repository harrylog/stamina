FROM node:alpine As development

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
RUN npm run build users

CMD ["npm", "run", "start:users:dev"]