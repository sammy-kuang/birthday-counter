# Use the official node image as a base
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the current React project files to the container
COPY . .

# Install the dependencies
RUN npm install

# Build the React project
RUN npm run build

RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the React app
CMD ["serve", "build/"]