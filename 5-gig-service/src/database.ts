import { winstonLogger } from '@ohjobber/shared';
import { gigConfig } from '@gig/config';
import { Logger } from 'winston';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${gigConfig.ELASTIC_SEARCH_URL}`, 'gigDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${gigConfig.DATABASE_URL}`);
    log.info('Gig service successfully connected to database.');
  } catch (error) {
    log.log('error', 'GigService databaseConnection() method error:', error);
  }
};

export { databaseConnection };
