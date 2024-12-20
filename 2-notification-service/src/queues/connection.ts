import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@ohjobber/shared';
import { notificationConfig } from '@notifications/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${notificationConfig.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

const createRabbitMQConnection = async (): Promise<Channel | undefined> => {
  try {
    const connection: Connection = await client.connect(`${notificationConfig.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Notification server connected to queue successfully');
    closeRabbitMQConnection(channel, connection);

    return channel;
  } catch (error) {
    log.log('error', 'NotificationService error createRabbitMQConnection() method:', error);
    return;
  }
};

const closeRabbitMQConnection = (channel: Channel, connection: Connection): void => {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
};

export { createRabbitMQConnection };
