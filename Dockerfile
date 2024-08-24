# Use the official Node.js 18 image.
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifest files to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy application code.
COPY . .

# Run the web service on container startup.
CMD [ "node", "server.js" ]
