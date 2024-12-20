import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@ohjobber/shared';
import { reviewConfig } from '@review/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${reviewConfig.ELASTIC_SEARCH_URL}`, 'reviewQueueConnection', 'debug');

async function createRabbitMQConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${reviewConfig.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Review server connected to queue successfully');
    closeRabbitMQConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'ReviewService error createRabbitMQConnection() method:', error);
    return;
  }
}

function closeRabbitMQConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createRabbitMQConnection };
