import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@ohjobber/shared';
import { Logger } from 'winston';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { chatConfig } from '@chat/config';

const log: Logger = winstonLogger(`${chatConfig.ELASTIC_SEARCH_URL}`, 'chatElasticSearch', 'debug');

const elasticSearchClient = new Client({
  node: `${chatConfig.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`ChatService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to ElasticSearch failed. Retrying...');
      log.log('error', 'ChatService checkConnection() method:', error);
    }
  }
};

export { checkConnection };
