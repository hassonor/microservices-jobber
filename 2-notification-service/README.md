# Notification Microservice

The Notification Microservice is responsible for sending out email notifications to users. This service supports various email templates for different user interactions.

## Email Templates

The following email templates are available in this service:

- `Forgot Password`
- `Verify Email`
- `Reset Password Success`
- `Offer`
- `Order Placed`
- `Order Receipt`
- `Order Extension Request`
- `Order Extension Approval`
- `Order Delivered`

## Tools & Technologies

This microservice leverages the following tools and technologies:

- **Your Shared Library**
- **Node.js**
- **Express**
- **TypeScript**
- **RabbitMQ**
- **Elasticsearch**
- **Nodemailer**
- **Email Templates**

Other dependencies are also included to support various functionalities.

## Setup Instructions

### Prerequisites

- Ensure that your shared library is published and accessible via NPM.
- Ensure that Docker is installed and running on your system.

### Environment Setup

1. **Install Dependencies:**

- After replacing the shared library references, install the necessary packages:
  ```bash
  npm install
  ```

2. **Setup Environment Variables:**

- Copy the contents of `.env.dev` to a new `.env` file:
  ```bash
  cp .env.dev .env
  ```
- Configure the following environment variables in the `.env` file:
  - `SENDER_EMAIL`: Obtain a sender email from [Ethereal](https://ethereal.email).
  - `SENDER_EMAIL_PASSWORD`: Obtain the corresponding password from [Ethereal](https://ethereal.email).

> **Note:** To view the sent emails, you must keep the Ethereal web page open. If you close it, you will need to recreate the email and password and update your `.env` file accordingly.

### Development

To start the service in development mode, use:

```bash
npm run dev


