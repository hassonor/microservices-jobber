import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@ohjobber/shared';
import { Logger } from 'winston';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { reviewConfig } from '@review/config';

const log: Logger = winstonLogger(`${reviewConfig.ELASTIC_SEARCH_URL}`, 'reviewElasticSearch', 'debug');

const elasticSearchClient = new Client({
  node: `${reviewConfig.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`ReviewService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to ElasticSearch failed. Retrying...');
      log.log('error', 'ReviewService checkConnection() method:', error);
    }
  }
};

export { checkConnection };
