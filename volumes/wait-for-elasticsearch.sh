#!/bin/bash
# wait-for-elasticsearch.sh

set -e

host="elasticsearch_container"
user="elastic"
password="admin1234"
kibana_password="kibana"

# Function to check if Elasticsearch is ready
check_elasticsearch() {
    curl -s -u "${user}:${password}" "http://${host}:9200/_cluster/health" | grep -q 'status'
}

# Wait for Elasticsearch to be ready
until check_elasticsearch; do
    echo "Waiting for Elasticsearch to be ready..."
    sleep 10
done

echo "Setting up Kibana system user password..."
curl -s -X POST -u "${user}:${password}" \
     -H "Content-Type: application/json" \
     "http://${host}:9200/_security/user/kibana_system/_password" \
     -d "{\"password\":\"${kibana_password}\"}"

echo "Elasticsearch setup completed successfully!"