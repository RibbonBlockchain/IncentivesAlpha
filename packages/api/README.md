# API

Ribbon Blockchain API

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

Creation of Argo CD config

```
argocd app create incentives-api \
  --repo https://github.com/RibbonBlockchain/IncentivesAlpha \
  --path API \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default
```
