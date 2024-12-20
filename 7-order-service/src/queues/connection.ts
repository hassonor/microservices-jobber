import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@ohjobber/shared';
import { orderConfig } from '@order/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${orderConfig.ELASTIC_SEARCH_URL}`, 'orderQueueConnection', 'debug');

async function createRabbitMQConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${orderConfig.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Order server connected to queue successfully');
    closeRabbitMQConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'OrderService error createRabbitMQConnection() method:', error);
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
