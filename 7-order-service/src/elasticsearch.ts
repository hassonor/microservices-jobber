import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@ohjobber/shared';
import { Logger } from 'winston';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { orderConfig } from '@order/config';

const log: Logger = winstonLogger(`${orderConfig.ELASTIC_SEARCH_URL}`, 'orderElasticSearch', 'debug');

const elasticSearchClient = new Client({
  node: `${orderConfig.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`OrderService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to ElasticSearch failed. Retrying...');
      log.log('error', 'OrderService checkConnection() method:', error);
    }
  }
};

export { checkConnection };
