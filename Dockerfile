# Use the Node.js Debian image
FROM node:20

# Install packages
RUN apt-get update && apt-get install -y supervisor sqlite3 && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY ./application/package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY ./application .

# Setup supervisord
COPY config/supervisord.conf /etc/supervisord.conf

# Expose the port the app runs on
EXPOSE 3000

# Start supervisord
ENTRYPOINT ["/usr/bin/supervisord", "-c" ,"/etc/supervisord.conf"]
