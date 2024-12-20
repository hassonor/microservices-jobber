import { Logger } from 'winston';
import { winstonLogger } from '@ohjobber/shared';
import { gigConfig } from '@gig/config';
import { Channel } from 'amqplib';
import { createRabbitMQConnection } from '@gig/queues/connection';

const log: Logger = winstonLogger(`${gigConfig.ELASTIC_SEARCH_URL}`, 'gigServiceProducer', 'debug');

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
    log.log('error', 'GigService publishDirectMessage() method error', error);
  }
};

export { publishDirectMessage };
