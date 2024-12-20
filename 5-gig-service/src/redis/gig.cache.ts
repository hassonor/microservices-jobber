import { Logger } from 'winston';
import { winstonLogger } from '@ohjobber/shared';
import { gigConfig } from '@gig/config';
import { client } from '@gig/redis/redis.connection';

const log: Logger = winstonLogger(`${gigConfig.ELASTIC_SEARCH_URL}`, 'gigCache', 'debug');

const getUserSelectedGigCategory = async (key: string): Promise<string> => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    const response: string = (await client.GET(key)) as string;
    return response;
  } catch (error) {
    log.log('error', 'GigService GigCache getUserSelectedGigCategory() method error:', error);
    return '';
  }
};

export { getUserSelectedGigCategory };
