#!/bin/bash

# Exit script on any error
set -e

# Step 1: Stop and remove all running containers, volumes, and images
echo "Stopping and removing all Docker services, networks, volumes, and images..."
docker-compose down -v --rmi all

# Step 2: Remove all stopped containers
echo "Removing all stopped containers..."
docker container prune -f

# Step 3: Remove all unused images
echo "Removing all unused images..."
docker image prune -a -f

# Step 4: Remove all unused volumes
echo "Removing all unused volumes..."
docker volume prune -f

# Step 5: Remove all unused networks
echo "Removing all unused networks..."
docker network prune -f

# Step 6: Remove Docker build cache
echo "Clearing Docker build cache..."
docker builder prune -a -f

# Step 7: Remove the shared_volume folder
echo "Removing the shared_volume folder..."
rm -rf ../shared_volume

# Final message
echo "Docker environment completely cleaned, including all caches and shared_volume."
