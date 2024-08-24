# Use the official Node.js 18 image.
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifest files to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm ci --only=production

# Copy application code.
COPY . .

# Optionally expose the port your app runs on (adjust if necessary).
EXPOSE 3000

# Optionally, add a healthcheck for your Node.js app.
# This checks if the app is responding on port 3000 (adjust as needed).
HEALTHCHECK --interval=30s --timeout=10s \
  CMD curl -f http://localhost:3000/ || exit 1

# Run the web service on container startup.
CMD [ "node", "server.js" ]
