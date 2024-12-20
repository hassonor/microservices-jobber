# Project Setup Guide

This document outlines the setup process for running the services and configuring the necessary tools for the project.

---

## Run Docker Compose Services

The following services need to be started in the order listed to prevent errors when running your microservices:

1. **Redis**
   ```bash
   docker compose up -d redis
   ```
2. **MongoDB**
   ```bash
   docker compose up -d mongodb
   ```
3. **MySQL**
   ```bash
   docker compose up -d mysql
   ```
4. **PostgreSQL**
   ```bash
   docker compose up -d postgres
   ```
5. **RabbitMQ**
   ```bash
   docker compose up -d rabbitmq
   ```
6. **Elasticsearch**
   ```bash
   docker compose up -d elasticsearch
   ```
   > Note: Elasticsearch may take 5-10 minutes to fully initialize.

---

## Setting up Kibana


1. **Create a Kibana Service Token**:
   From the Elasticsearch container terminal, run:
   ```bash
   bin/elasticsearch-service-tokens create elastic/kibana jobber-kibana
   ```
   > Copy the generated token and add it to the Kibana environment variable `ELASTICSEARCH_SERVICEACCOUNT_TOKEN` in
   your `docker-compose` file.

---

## Heartbeat Configuration

- Update the `heartbeat.yml` file by replacing `<your-ip-address>` with your system's IP address.

---

## Running Microservices

You can run the microservices using one of the following methods:

### 1. Using Docker Compose

Run:

```bash
docker compose up -d
```

### 2. Using npm

Run each service manually for better error monitoring:

```bash
npm run dev
```

> **Note**: Always start the `gateway service` last, ensuring all other services are running beforehand.

---

## Setting up Jenkins Master and Agent: TODO: Make script

To set up Jenkins for managing builds and deployments, follow these steps:

### 1. Generate SSH Keys

Create an RSA key pair:

```bash
ssh-keygen -t rsa -b 4096 -f jenkins_key
```

- Add the public key to `.env.jenkins` in your `docker-compose` setup.

### 2. Configure a Jenkins Node

- Create a new node in Jenkins:
    - Select **Permanent Agent**.
    - Configure SSH using the generated private key.

### 3. Prepare Jenkins Agent

Run the following commands on the Jenkins agent container:

```bash
apt update
apt install -y docker.io passwd curl
gpasswd -a jenkins docker
service docker start
docker restart <jenkins-agent-container-id>
```

### 4. Install `kubectl` on Jenkins Agent

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
chmod +x kubectl
mkdir -p ~/.local/bin
mv ./kubectl ~/.local/bin/kubectl
```

### 5. Install Jenkins Plugins

Install the following plugins:

- **Docker**
- **NodeJS**
- **CloudBees Docker Build and Publish**
- **Kubernetes**
- **Kubernetes CLI**
- **Kubernetes Credentials Provider**

### 6. Configure Jenkins Credentials

- **DockerHub Token**:
    - Add a new **Username with password** credential with ID: `dockerhub`.
- **GitHub Token**:
    - Add a new **Username with password** credential with ID: `github`.
- **Kubernetes Token**:
    - Add a new **Secret text** credential with ID: `jenkins-k8s-token`.

### 7. Configure Jenkins Tools

- **NodeJS**:
    - Add a new NodeJS installation with global packages: `npm install -g npm@latest`.
- **Docker**:
    - Add a Docker installation with automatic download from docker.com.

### 8. Add Kubernetes Cloud Configuration

In **Manage Jenkins**, add a new cloud:

- Name: `minikube-k8s`
- Type: **Kubernetes**.

### 9. Add Jenkins Pipeline

1. Press "Add Item"
2. "jobber-reviews" as item name
3. Select "Pipeline"
4. Click on "OK"
5. Description: "Jenkins pipeline for jobber review service."
6. Select "Discard old builds"
7. Max# of builds to keep: 5
8. On Pipeline Definition: Dropbox -> Pipeline script from SCM, SCM -> Git, Paste the Repository URL (Repo from GitHub)
9. Select Credentials: Your Credentials (GitHub)
10. Press on "Save"

### 10. Add Pipeline Syntax

1. Credentials: Jenkins kubernetes token
2. Get the server kubectl ip: `kubectl config view` (On Your local machine terminal)
3. Copy the IP to the pipeline -> Paste on `Kuberenetes API endpoint`
4. Get the Cluster name -> Paster on `Cluster name` and on `Context`
5. Press on `Generate Pipeline Script` and copy the script to Jenkinsfile

### 11. Configure GitHub Webhook

1. Go to `jobber-reviews` Configuration
2. Mark `Github hook trigger for GITScm polling`
3. Go To ngrok site create a user and to the following `https://dashboard.ngrok.com/get-started/your-authtoken`
4. Run on Terminal `ngrok http 8080`
5. Copy the Forwarding ngrok url
6. Go To GitHub Repo of `jobber-review`
7. Go to `Settings`
8. Press `Webhooks`
9. Press `Add Webhook`
10. Add Payload URL: Copy the Forwarding ngrok url + '/github-webhook/'
11. Content Type Change to Application JSON
12. Press `Add Webhook`
