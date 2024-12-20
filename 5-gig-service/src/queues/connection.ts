import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@ohjobber/shared';
import { gigConfig } from '@gig/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${gigConfig.ELASTIC_SEARCH_URL}`, 'gigQueueConnection', 'debug');

async function createRabbitMQConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${gigConfig.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Gig server connected to queue successfully');
    closeRabbitMQConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'GigService error createRabbitMQConnection() method:', error);
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
