import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@ohjobber/shared';
import { Logger } from 'winston';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { gatewayConfig } from '@gateway/config';

const log: Logger = winstonLogger(`${gatewayConfig.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');

const elasticSearchClient = new Client({
  node: `${gatewayConfig.ELASTIC_SEARCH_URL}`
});

const RETRY_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 25;

export const checkElasticSearchConnection = async (): Promise<void> => {
  let isConnected = false;
  let retries = 0;

  while (!isConnected && retries < MAX_RETRIES) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`GatewayService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      retries += 1;
      log.error(`Connection to ElasticSearch failed. Retrying in ${RETRY_INTERVAL / 1000} seconds... (Attempt ${retries}/${MAX_RETRIES})`);
      log.log('error', 'GatewayService checkElasticSearchConnection() method:', (error as Error).message);

      if (retries < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      } else {
        log.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
};
