# Use the Playwright base image which includes all the browsers
FROM mcr.microsoft.com/playwright:v1.47.2-focal as BASE

# Create a non-root user 'chromeuser'
RUN useradd -ms /bin/bash chromeuser

# Set up the working directory and give permissions to 'chromeuser'
RUN mkdir -p /app \
    && chown -R chromeuser:chromeuser /app \
    && mkdir -p /home/chromeuser/.cache \
    && chown -R chromeuser:chromeuser /home/chromeuser/.cache

# Change to non-root user
USER chromeuser

# Set the working directory for the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY --chown=chromeuser:chromeuser package*.json ./

# Install project dependencies
RUN npm install

# Install Playwright and force browser installation
RUN npx playwright install --with-deps

# Copy the rest of the application code
COPY --chown=chromeuser:chromeuser . .

# Show files to debug potential issues
RUN echo "SHOW FILES" && ls -la
RUN echo "SHOW FILES detail" && ls / -la

# Build the application (if using TypeScript or builders like Next.js/NestJS)
RUN npm run build

# Expose the port (Heroku uses the $PORT environment variable)
EXPOSE $PORT

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
