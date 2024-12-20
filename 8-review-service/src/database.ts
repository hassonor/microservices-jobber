import { winstonLogger } from '@ohjobber/shared';
import { reviewConfig } from '@review/config';
import { Logger } from 'winston';
import { Pool } from 'pg';

const log: Logger = winstonLogger(`${reviewConfig.ELASTIC_SEARCH_URL}`, 'reviewDatabaseServer', 'debug');

const pool: Pool = new Pool({
  host: `${reviewConfig.DATABASE_HOST}`,
  user: `${reviewConfig.DATABASE_USER}`,
  password: `${reviewConfig.DATABASE_PASSWORD}`,
  port: 5432,
  database: `${reviewConfig.DATABASE_NAME}`
});

pool.on('error', (error: Error) => {
  log.log('error', 'pg client error', error);
  process.exit(-1);
});

const createTableText = `
    CREATE TABLE IF NOT EXISTS public.reviews (
      id SERIAL UNIQUE,
      gigId TEXT NOT NULL,
      reviewerId TEXT NOT NULL,
      orderId TEXT NOT NULL,
      sellerId TEXT NOT NULL,
      review TEXT NOT NULL,
      reviewerImage TEXT NOT NULL,
      reviewerUsername text NOT NULL,
      country TEXT NOT NULL,
      reviewType TEXT NOT NULL,
      rating INTEGER DEFAULT 0 NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_DATE,
      PRIMARY KEY(id)
      );

   CREATE INDEX IF NOT EXISTS gigId_idx ON public.reviews (gigId);
   CREATE INDEX IF NOT EXISTS sellerId_idx ON public.reviews (sellerId);
`;

const databaseConnection = async (): Promise<void> => {
  try {
    await pool.connect();
    log.info('Review service successfully connected to postgresql database.');
    await pool.query(createTableText);
  } catch (error) {
    log.error('ReviewService - Unable to connect to database');
    log.log('error', 'ReviewService () method error:', error);
  }
};

export { databaseConnection, pool };
