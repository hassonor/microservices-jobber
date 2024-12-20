import { Logger } from 'winston';
import { winstonLogger } from '@ohjobber/shared';
import { authConfig } from '@auth/config';
import { Channel } from 'amqplib';
import { createRabbitMQConnection } from '@auth/queues/connection';

const log: Logger = winstonLogger(`${authConfig.ELASTIC_SEARCH_URL}`, 'authServiceProducer', 'debug');

export async function publishDirectMessage(
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createRabbitMQConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'AuthService Provider publishDirectMessage() method error:', error);
  }
}
