# API Gateway Microservice

The API Gateway Microservice is responsible for managing and routing all requests that come from the frontend of the application. Every request must pass through the API Gateway service, which handles request validation, authentication, and communication with other microservices.

## Key Features

- **Request Handling**: Routes all frontend requests to appropriate backend microservices.
- **Request Validation**: Validates requests, adds JSON web tokens (JWT) to the cookie session, and checks if the token in the request is valid.
- **Error Management**:
  - **Client-Side Errors**: Client-side errors from other microservices are passed through the gateway and sent to the client.
  - **Server-Side Errors**: Server-side errors from the gateway are sent to Elasticsearch and can be viewed on Kibana.
- **Communication**: The service uses the Request/Response pattern to communicate with other services.

## Tools & Libraries

The API Gateway service uses the following main tools and libraries:

- **Your Shared Library**
- **Node.js**
- **Express**
- **TypeScript**
- **Axios**
- **Redis**
- **Elasticsearch**
- **JSON Web Token**
- **Socket.IO** (client and server)

Additional dependencies are included as necessary.

## Setup Instructions

### Prerequisites

- Ensure that Docker is installed and running on your system.

### Steps

1. **Install Dependencies**:
  - After replacing shared library references, run the following command to install the necessary packages
