import { Client } from '@elastic/elasticsearch';
import { ISellerGig, winstonLogger } from '@ohjobber/shared';
import { Logger } from 'winston';
import { ClusterHealthResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { authConfig } from '@auth/config';

const log: Logger = winstonLogger(`${authConfig.ELASTIC_SEARCH_URL}`, 'authElasticSearch', 'debug');

const elasticSearchClient = new Client({
  node: `${authConfig.ELASTIC_SEARCH_URL}`
});

const RETRY_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 25;

async function checkElasticSearchConnection(): Promise<void> {
  let isConnected = false;
  let retries = 0;

  while (!isConnected && retries < MAX_RETRIES) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      retries += 1;
      log.error(`Connection to ElasticSearch failed. Retrying in ${RETRY_INTERVAL / 1000} seconds... (Attempt ${retries}/${MAX_RETRIES})`);
      log.log('error', 'AuthService checkElasticSearchConnection() method:', (error as Error).message);

      if (retries < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      } else {
        log.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
}

async function createIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await elasticSearchClient.indices.exists({ index: indexName });
    if (result) {
      log.info(`Index "${indexName}" already exist.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error occurred while creating the index ${indexName}`);
    log.log('error', 'AuthService createIndex() method error:', error);
  }
}

async function getDocumentById(index: string, gigId: string): Promise<ISellerGig> {
  try {
    const result: GetResponse = await elasticSearchClient.get({
      index,
      id: gigId
    });
    return result._source as ISellerGig;
  } catch (error) {
    log.log('error', 'AuthService elasticsearch getDocumentById() method error:', error);
    return {} as ISellerGig;
  }
}

export { elasticSearchClient, checkElasticSearchConnection, createIndex, getDocumentById };
