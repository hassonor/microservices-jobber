import { Logger } from 'winston';
import { winstonLogger } from '@ohjobber/shared';
import { chatConfig } from '@chat/config';
import { Channel } from 'amqplib';
import { createRabbitMQConnection } from '@chat/queues/connection';

const log: Logger = winstonLogger(`${chatConfig.ELASTIC_SEARCH_URL}`, 'chatServiceProducer', 'debug');

const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createRabbitMQConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'ChatService publishDirectMessage() method error', error);
  }
};

export { publishDirectMessage };
