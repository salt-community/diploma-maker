# Use the official Node.js image to build the application
FROM node:20 AS build
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Use an official Nginx image to serve the application
FROM nginx:alpine

# Copy the custom Nginx configuration template
COPY nginx.conf /etc/nginx/nginx.template.conf

# Copy the entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy the built application
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Set the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
