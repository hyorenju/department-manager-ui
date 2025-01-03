# Build stage
FROM node:latest AS build

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./
COPY yarn.lock .

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the React app
#RUN yarn build

# Expose port
EXPOSE 3000

# Start React app
CMD [ "yarn", "start" ]