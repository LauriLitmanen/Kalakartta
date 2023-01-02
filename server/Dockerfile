FROM node

# set a directory for the app
WORKDIR /app

# copy files from package.json
COPY package.json .

# install dependencies
RUN npm install

# copy all the files to the container
COPY . .

# backend is running on port 1337
EXPOSE 1337

CMD ["npm", "start"]