# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set Environment Variables
ARG JWT_SECRET
ARG DATABASE_URL

ENV PORT=8000
ENV JWT_SECRET=$JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma Client
RUN npm run setup

# Build TypeScript files
RUN npm run build

# Expose port 8000
EXPOSE 8000

# Command to run the application using npm run start
CMD ["npm", "run", "start"]