import { winstonLogger } from '@ohjobber/shared';
import { gigConfig } from '@gig/config';
import { Logger } from 'winston';
import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;
const log: Logger = winstonLogger(`${gigConfig.ELASTIC_SEARCH_URL}`, 'gigRedisConnection', 'debug');
const client: RedisClient = createClient({ url: `${gigConfig.REDIS_HOST}` });

const redisConnect = async (): Promise<void> => {
  try {
    await client.connect();
    log.info(`GigService Redis Connection: ${await client.ping()}`);
    cacheError();
  } catch (error) {
    log.log('error', 'GigService redisConnect() method error:', error);
  }
};

const cacheError = (): void => {
  client.on('error', (error: unknown) => {
    log.error(error);
  });
};

export { redisConnect, client };
