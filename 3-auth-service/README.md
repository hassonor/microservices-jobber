# Authentication Microservice

## Overview

The Authentication Microservice is responsible for managing user accounts within the application. When a user creates an account, they are automatically designated as a buyer. Upon successful account creation, the service publishes an event to the Users Service to add buyer data to MongoDB.

Server-side errors from the Authentication Microservice are logged to Elasticsearch and can be viewed in Kibana.

## Tools and Technologies

This service is built with the following tools and technologies:

- **Node.js**
- **Express**
- **TypeScript**
- **RabbitMQ**
- **Elasticsearch**
- **MySQL** (with Sequelize ORM)
- **JSON Web Token (JWT)**
- **Faker** (for seed data)
- **Your shared library**

Other supporting packages and libraries are also used.

## Setup Instructions

### Node.js Version Update

You can update the Node.js version in the `Dockerfile` and `Dockerfile.dev` as needed.

### Shared Library Integration

1. Run the `npm install` command to install dependencies.

### Environment Variables

1. Copy the contents of `.env.dev` to a new `.env` file.
2. Create an account on [Cloudinary](https://cloudinary.com).
3. Add your `cloud name`, `cloud secret`, and `cloud API key` to the `.env` file.
4. Generate new `GATEWAY_JWT_TOKEN` and `JWT_TOKEN` values and add them to the `.env` file.

- Ensure these tokens are consistent across all microservices that require them.

### Running the Service

You can start the service with the following command:

```bash
npm run dev
```

### Create docker images

* You can create your own docker image from this microservice.
* Create an account on `hub.docker.com` or login if you already have one.
* Make sure to login on your terminal as well.
* Steps to build and push your image to docker hub
  * `docker build -t <your-dockerhub-username>/jobber-auth .`
  * `docker tag <your-dockerhub-username>/jobber-auth <your-dockerhub-username>/jobber-auth:stable`
  * `docker push <your-dockerhub-username>/jobber-auth:stable`

### Upload Elastic dump data

* Run: `npm install elasticdump -g`
* `elasticdump --input=./gigs.json --output=http://elastic:admin1234@localhost:9200/gigs --type=data`
