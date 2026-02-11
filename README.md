# 🚀 Microservices Jobber Platform

<div align="center">

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.x-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)
![Build](https://img.shields.io/badge/build-passing-success)

**A production-ready freelance marketplace built with microservices architecture**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Services](#-services)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [CI/CD](#-cicd)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Microservices Jobber** is a full-featured freelance marketplace platform demonstrating **production-grade microservices architecture**. Built with TypeScript, Node.js, and modern cloud-native technologies, this project serves as both a learning resource and a foundation for building scalable SaaS applications.

### Why This Project?

- ✅ **Production-Ready**: Real-world patterns, error handling, monitoring
- ✅ **Event-Driven**: RabbitMQ message queuing between services
- ✅ **Cloud-Native**: Docker, Kubernetes, horizontal scaling
- ✅ **Full Observability**: Elasticsearch, Kibana, Heartbeat monitoring
- ✅ **Educational**: Clear code, comprehensive documentation, best practices

---

## ✨ Features

### Core Functionality
- 🔐 **Authentication & Authorization**: JWT tokens, refresh tokens, 2FA support
- 👥 **User Management**: Profiles, roles, permissions, email verification
- 💼 **Gig Management**: Create, browse, search, filter freelance services
- 💬 **Real-time Chat**: WebSocket-based messaging between users
- 📦 **Order Management**: Complete order lifecycle with payment integration
- ⭐ **Review System**: Ratings, reviews, reputation scores
- 📧 **Notifications**: Email, in-app, push notifications
- 🔍 **Full-text Search**: Elasticsearch-powered gig and user search

### Technical Features
- 🎯 **API Gateway**: Centralized entry point with rate limiting
- 🔄 **Event-Driven Communication**: Async messaging with RabbitMQ
- 💾 **Polyglot Persistence**: MongoDB, MySQL, PostgreSQL, Redis
- 📊 **Monitoring**: Elasticsearch, Kibana, Heartbeat, APM
- 🚀 **Horizontal Scaling**: Stateless services, Redis sessions
- 🐳 **Containerized**: Docker Compose for local, Kubernetes for production

---

## 🛠 Tech Stack

### Backend Services (8 Microservices)
| Service | Technology | Database | Description |
|---------|-----------|----------|-------------|
| **Gateway** | Express.js, TypeScript | Redis | API Gateway with rate limiting |
| **Notification** | Express.js, TypeScript | MongoDB | Email and push notifications |
| **Auth** | Express.js, TypeScript | PostgreSQL | Authentication & authorization |
| **Users** | Express.js, TypeScript | MongoDB | User profiles and management |
| **Gig** | Express.js, TypeScript | MongoDB | Freelance service listings |
| **Chat** | Express.js, TypeScript | MongoDB | Real-time messaging |
| **Order** | Express.js, TypeScript | MySQL | Order processing & payments |
| **Review** | Express.js, TypeScript | PostgreSQL | Ratings and reviews |

### Infrastructure
- **Message Queue**: RabbitMQ
- **Cache**: Redis 7
- **Search**: Elasticsearch 8
- **Monitoring**: Kibana, Heartbeat
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes (production)

### Shared Libraries
- **@ohjobber/shared**: Common utilities, types, middlewares

---

## 🏗 Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│              (Web App, Mobile App, Third-party)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Gateway                                │
│  ┌───────────┐  ┌──────────────┐  ┌────────────────────┐       │
│  │Rate Limit │─▶│Authentication│─▶│Request Routing     │       │
│  └───────────┘  └──────────────┘  └────────────────────┘       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┬──────────────┐
          ▼               ▼               ▼              ▼
    ┌─────────┐     ┌─────────┐    ┌─────────┐   ┌──────────┐
    │  Auth   │     │  User   │    │   Gig   │   │   Chat   │
    │ Service │     │ Service │    │ Service │   │  Service │
    └────┬────┘     └────┬────┘    └────┬────┘   └────┬─────┘
         │               │              │             │
    ┌─────────┐     ┌─────────┐    ┌─────────┐   ┌──────────┐
    │ Order   │     │ Review  │    │  Notif  │   │ Gateway  │
    │ Service │     │ Service │    │ Service │   │   API    │
    └────┬────┘     └────┬────┘    └────┬────┘   └──────────┘
         │               │              │
         └───────────────┴──────────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        ┌───────────┐        ┌────────────┐
        │ RabbitMQ  │        │   Redis    │
        │ (Events)  │        │  (Cache)   │
        └───────────┘        └────────────┘
              │
              ▼
   ┌─────────────────────────────┐
   │  Data Layer (Polyglot)      │
   ├─────────────┬───────────────┤
   │  MongoDB    │ PostgreSQL    │
   │  MySQL      │ Elasticsearch │
   └─────────────┴───────────────┘
```

### Service Communication Patterns

1. **Synchronous**: HTTP/REST for request-response operations
2. **Asynchronous**: RabbitMQ events for fire-and-forget operations
3. **Caching**: Redis for sessions, rate limiting, frequently accessed data
4. **Search**: Elasticsearch for full-text search with denormalized data

---

## 🚀 Quick Start

Get the entire platform running locally in **10 minutes**:

### Prerequisites

- **Node.js** >= 20.x
- **Docker** & **Docker Compose** >= 20.x
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/hassonor/microservices-jobber.git
cd microservices-jobber

# 2. Start infrastructure services (takes 5-10 min for Elasticsearch)
cd volumes
docker-compose up -d redis mongodb mysql postgres rabbitmq elasticsearch

# 3. Create Kibana service token
docker exec -it <elasticsearch-container-id> bash
bin/elasticsearch-service-tokens create elastic/kibana jobber-kibana
# Copy the token and add to ELASTICSEARCH_SERVICEACCOUNT_TOKEN in docker-compose.yml

# 4. Start Kibana
docker-compose up -d kibana

# 5. Update heartbeat.yml with your IP address
# Replace <your-ip-address> in volumes/heartbeat.yml

# 6. Install dependencies for all services
npm install --workspaces

# 7. Start services (recommended order)
cd ../2-notification-service && npm run dev &
cd ../3-auth-service && npm run dev &
cd ../4-users-service && npm run dev &
cd ../5-gig-service && npm run dev &
cd ../6-chat-service && npm run dev &
cd ../7-order-service && npm run dev &
cd ../8-review-service && npm run dev &
cd ../1-gateway-service && npm run dev  # Start gateway last
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **API Gateway** | http://localhost:4000 | Main entry point |
| **Elasticsearch** | http://localhost:9200 | Search engine |
| **Kibana** | http://localhost:5601 | Monitoring dashboard |
| **RabbitMQ** | http://localhost:15672 | Message queue UI (guest/guest) |

---

## 📁 Project Structure

```
microservices-jobber/
├── 1-gateway-service/         # API Gateway (port 4000)
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, rate limiting, validation
│   │   ├── routes/            # API routes
│   │   └── server.ts          # Express app setup
│   ├── package.json
│   └── tsconfig.json
│
├── 2-notification-service/    # Email & push notifications
│   ├── src/
│   │   ├── queues/            # RabbitMQ consumers
│   │   ├── templates/         # Email templates
│   │   └── server.ts
│   └── package.json
│
├── 3-auth-service/            # Authentication (port 4002)
│   ├── src/
│   │   ├── controllers/       # Login, signup, refresh
│   │   ├── models/            # User model
│   │   ├── services/          # JWT, bcrypt logic
│   │   └── server.ts
│   └── package.json
│
├── 4-users-service/           # User profiles (port 4003)
├── 5-gig-service/             # Gig listings (port 4004)
├── 6-chat-service/            # Messaging (port 4005)
├── 7-order-service/           # Orders & payments (port 4006)
├── 8-review-service/          # Ratings & reviews (port 4007)
│
├── volumes/                   # Docker infrastructure
│   ├── docker-compose.yaml    # All infrastructure services
│   └── heartbeat.yml          # Elasticsearch monitoring
│
├── .cursorrules              # AI coding assistant configuration
├── .github/
│   ├── dependabot.yml        # Automated dependency updates
│   └── workflows/            # CI/CD pipelines
└── README.md
```

---

## 🔧 Services

### 1. Gateway Service (Port 4000)
**Entry point for all client requests**

- Rate limiting (100 req/15min per IP)
- Authentication middleware
- Request validation
- Service routing
- CORS configuration

**Key Endpoints**:
```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
GET    /api/v1/gigs/search
POST   /api/v1/orders
```

### 2. Notification Service
**Async email and push notifications**

- Email templates (signup, order confirmation, etc.)
- SendGrid/Mailgun integration
- RabbitMQ consumer for notification events
- Notification history tracking

### 3. Auth Service (Port 4002)
**JWT-based authentication**

- User registration with email verification
- Login with refresh token rotation
- Password reset flow
- 2FA support (optional)

### 4. Users Service (Port 4003)
**User profile management**

- Profile CRUD operations
- Seller/buyer profiles
- Avatar upload (Cloudinary)
- Activity history

### 5. Gig Service (Port 4004)
**Freelance service listings**

- Create/update/delete gigs
- Full-text search (Elasticsearch)
- Category filtering
- Image uploads (Cloudinary)

### 6. Chat Service (Port 4005)
**Real-time messaging**

- WebSocket connections
- Message persistence (MongoDB)
- Conversation history
- Typing indicators

### 7. Order Service (Port 4006)
**Order processing & payments**

- Order lifecycle management
- Stripe/PayPal integration
- Order status updates via events
- Refund handling

### 8. Review Service (Port 4007)
**Ratings and reviews**

- Create/update reviews
- Seller rating calculation
- Review moderation
- Aggregate statistics

---

## 💻 Development

### Environment Setup

Each service requires a `.env` file:

```bash
# Example for auth-service/.env
NODE_ENV=development
PORT=4002
DATABASE_URL=postgresql://user:pass@localhost:5432/jobber_auth
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-secret
RABBITMQ_URL=amqp://localhost:5672
REDIS_URL=redis://localhost:6379
```

### Running Individual Services

```bash
# Development mode with hot reload
cd 3-auth-service
npm run dev

# Production mode
npm run build
npm start

# Lint & format
npm run lint
npm run lint:fix
```

### Code Quality

This project follows strict TypeScript and ESLint rules:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking
npm run type-check
```

### Shared Package

Common utilities are in `@ohjobber/shared`:

```typescript
import { BadRequestError, NotFoundError } from '@ohjobber/shared';
import { CustomResponse, IAuthPayload } from '@ohjobber/shared';
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run tests for a service
cd 3-auth-service
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Integration Tests

```bash
# Run integration tests (requires Docker)
npm run test:integration
```

### E2E Tests

```bash
# Start all services first
npm run dev:all

# Run E2E tests
npm run test:e2e
```

---

## 🚢 Deployment

### Docker Compose (Development)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f gateway

# Stop all services
docker-compose down
```

### Kubernetes (Production)

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get services

# Scale a service
kubectl scale deployment gig-service --replicas=3
```

### Environment Variables (Production)

Required secrets for production:

```bash
JWT_SECRET=<strong-random-secret>
REFRESH_TOKEN_SECRET=<strong-random-secret>
DATABASE_URL=<production-db-url>
REDIS_URL=<production-redis-url>
RABBITMQ_URL=<production-rabbitmq-url>
CLOUDINARY_API_KEY=<your-key>
CLOUDINARY_API_SECRET=<your-secret>
STRIPE_SECRET_KEY=<your-key>
SENDGRID_API_KEY=<your-key>
```

---

## 🔄 CI/CD

### GitHub Actions

Automated workflows for:

- **Linting**: ESLint on every push
- **Testing**: Unit + integration tests
- **Security**: Dependabot for vulnerabilities
- **Build**: Docker image builds
- **Deploy**: Automatic deployment to staging on PR merge

### Jenkins (Alternative)

Jenkins pipeline configuration included in `Jenkinsfile`:

```groovy
pipeline {
  stages {
    stage('Test') { ... }
    stage('Build') { ... }
    stage('Deploy') { ... }
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow the existing `.cursorrules` configuration
- Write unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by production freelance platforms like Upwork and Fiverr
- Built for educational purposes to demonstrate microservices architecture
- Special thanks to the open-source community for the amazing tools

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/hassonor/microservices-jobber/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hassonor/microservices-jobber/discussions)

---

<div align="center">

**Made with ❤️ by [Or Hasson](https://github.com/hassonor)**

⭐ Star this repo if you find it helpful!

</div>
