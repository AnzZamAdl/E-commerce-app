# Use official Node.js image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose the application port (assume it runs on 3000)
EXPOSE 8081

# Start the app
CMD ["npm", "start"]
