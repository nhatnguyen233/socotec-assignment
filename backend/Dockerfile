FROM node:22-alpine

WORKDIR /app

# Copy package.json and lock files to leverage Docker caching
COPY ./package.json ./package-lock.json ./

# Install dependencies
RUN npm install --force

# Copy the application code
COPY . .

# Expose the backend port
EXPOSE 3002

# Use nodemon for development
CMD ["npm", "start"]
