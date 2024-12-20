import { winstonLogger } from '@ohjobber/shared';
import { usersConfig } from '@users/config';
import { Logger } from 'winston';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${usersConfig.ELASTIC_SEARCH_URL}`, 'usersDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${usersConfig.DATABASE_URL}`);
    log.info('User service successfully connected to database.');
  } catch (error) {
    log.log('error', 'UsersService databaseConnection() method error:', error);
  }
};

export { databaseConnection };
