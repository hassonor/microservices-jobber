import { Client } from '@elastic/elasticsearch';
import { notificationConfig } from '@notifications/config';
import { winstonLogger } from '@ohjobber/shared';
import { Logger } from 'winston';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(`${notificationConfig.ELASTIC_SEARCH_URL}`, 'notificationElasticSearch', 'debug');

const elasticSearchClient = new Client({
  node: `${notificationConfig.ELASTIC_SEARCH_URL}`
});

const RETRY_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 25;

export const checkElasticSearchConnection = async (): Promise<void> => {
  let isConnected = false;
  let retries = 0;

  while (!isConnected && retries < MAX_RETRIES) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`NotificationService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      retries += 1;
      log.error(`Connection to ElasticSearch failed. Retrying in ${RETRY_INTERVAL / 1000} seconds... (Attempt ${retries}/${MAX_RETRIES})`);
      log.log('error', 'NotificationService checkElasticSearchConnection() method:', (error as Error).message);

      if (retries < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      } else {
        log.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
};
