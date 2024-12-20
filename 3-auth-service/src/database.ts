import { Logger } from 'winston';
import { Sequelize } from 'sequelize';
import { authConfig } from '@auth/config';
import { winstonLogger } from '@ohjobber/shared';

const log: Logger = winstonLogger(`${authConfig.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

export const sequelize: Sequelize = new Sequelize(authConfig.MYSQL_DB!, {
  dialect: 'mysql',
  logging: console.log,
  dialectOptions: {
    multipleStatements: true
  }
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    log.info('AuthService MySQL database connection has been established successfully.');
  } catch (error) {
    log.error('Auth Service - Unable to connect to database.');
    log.log('error', 'AuthService databaseConnection() method error:', error);
  }
}
