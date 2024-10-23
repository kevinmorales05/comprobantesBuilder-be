# Use the Playwright base image that includes browsers
FROM mcr.microsoft.com/playwright:v1.48.1-focal as BASE

# Set environment variable to ensure Playwright uses the correct cache path
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Create a non-root user called 'chromeuser'
RUN useradd -ms /bin/bash chromeuser

# Create working directory and give permissions to the non-root user
RUN mkdir -p /app \
    && chown -R chromeuser:chromeuser /app \
    && mkdir -p /home/chromeuser/.cache \
    && chown -R chromeuser:chromeuser /home/chromeuser/.cache

# Switch to non-root user
USER chromeuser

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Show the structure of the filesystem
RUN echo "SHOW FILES"
RUN ls -la

# Build the application (if needed)
RUN npm run build

# Expose the port (Heroku uses the $PORT env variable)
EXPOSE $PORT

# Command to start the application
CMD ["npm", "run", "start:prod"]