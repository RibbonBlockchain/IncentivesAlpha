# Back End

Ribbon blockchain has a RESTful API which is used to store patient information and healthcare interaction. Future implementations will see this replaced with something like 3Box to provided decentralized profiles for patients. For now however we need to have strict control over the medical records used within the system. As a result we store them within a MongoDB with a permissioned API in front of it which implements role based access control.

This API is wrapped in a docker container along with the mongodb to make deployment of the infrastructure controllable, scalable and reproducible.

## Requirements

[NodeJS](https://nodejs.org/en/)

Install global TypeScript and TypeScript Node

```
npm install -g typescript ts-node
```

## Getting Started

You should install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) on your local machine, or use other services such as [mLab](https://mlab.com/) or [Compose](https://www.compose.com/compare/mongodb)

After that, you will have to replace the mongoURL with your MongoDB address in _lib/app.ts_

## Clone this repository

```
git clone git@github.com:dalenguyen/rest-api-node-typescript.git .
```

Then install the dependencies

```
npm install
```

## Start the server

Run in development mode

```
npm run dev
```

Run in production mode

```
npm run prod
```

## Docker-compose

```
docker-compose up
```

## Kuberneties run within your local enviroment

update the kuberneties files from the docker-compose.

```
kubectl apply -f incentives-api-service.yaml,incentives-api-deployment.yaml,incentives-api-env-configmap.yaml,mongodb-service.yaml,mongodb-deployment.yaml,mongodb-env-configmap.yaml,mongodata-persistentvolumeclaim.yaml,secret.yaml
```

Run the kuberneties tunnel to connect to localhost

```
minikube tunnel
```
