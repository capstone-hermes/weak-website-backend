# Dockerfile for NestJS server

# Use Node.js 20
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Serve the app
CMD ["npm", "run", "start:dev"]
