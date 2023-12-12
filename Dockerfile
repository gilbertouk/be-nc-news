# Use the official Node image with version 18.16.1
FROM node:18.16.1

# Create and set the working directory
WORKDIR /app

# Clone the repository
RUN git clone https://github.com/gilbertouk/be-nc-news.git .

# Install project dependencies
RUN npm install

# Set the environment variables
ENV DATABASE_URL=URL_TO_YOUR_POSTGRESQL
ENV NODE_ENV=production

# Expose the port your app will run on (adjust if needed)
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]
