#Set up Docker Container
FROM node:10-alpine

#Make directory to store API and copy config files
RUN mkdir /home/API
WORKDIR /home/API
COPY . .

#Install required packages and build API
RUN apk --no-cache --virtual build-dependencies add python make g++
RUN npm install
RUN npm run build

#start API container
EXPOSE 3000
CMD [ "npm","run", "start" ]