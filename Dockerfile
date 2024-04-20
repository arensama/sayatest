# Use Node.js 18.17.0 image as base
FROM node:18.17.0

# Set working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port 4000 (for Express.js) 
EXPOSE 4000

# Command to start the development server
CMD ["npm", "run", "dev"]
