import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@ohjobber/shared';
import { usersConfig } from '@users/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${usersConfig.ELASTIC_SEARCH_URL}`, 'usersQueueConnection', 'debug');

const createRabbitMQConnection = async (): Promise<Channel | undefined> => {
  try {
    const connection: Connection = await client.connect(`${usersConfig.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('UsersService connected to queue successfully');
    closeRabbitMQConnection(channel, connection);

    return channel;
  } catch (error) {
    log.log('error', 'UsersService error createRabbitMQConnection() method:', error);
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
