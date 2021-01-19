FROM node:15.5.1-alpine3.10

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .
RUN rm -rf node_modules

# Install NPM dependencies
RUN npm install

# Add crontab
RUN /usr/bin/crontab crontab

# Run the command on container startup
CMD /usr/sbin/crond -f
