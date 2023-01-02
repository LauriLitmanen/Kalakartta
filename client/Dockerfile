FROM node

# set a directory for the app
WORKDIR /app

# copy files from package.json
COPY package.json .

# install dependencies
RUN npm install

# copy all the files to the container
COPY . .

# frontend is running on port 3000
EXPOSE 3000

CMD ["npm", "start"]