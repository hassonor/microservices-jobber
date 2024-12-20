import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@ohjobber/shared';
import { chatConfig } from '@chat//config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${chatConfig.ELASTIC_SEARCH_URL}`, 'chatQueueConnection', 'debug');

async function createRabbitMQConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${chatConfig.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Chat server connected to queue successfully');
    closeRabbitMQConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'ChatService error createRabbitMQConnection() method:', error);
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
