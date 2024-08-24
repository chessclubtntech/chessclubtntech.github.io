# Use the official Node.js 14 image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifest files to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy application code.
COPY . .

# Run the web service on container startup.
CMD [ "node", "server.js" ]
