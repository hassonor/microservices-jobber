import { Logger } from 'winston';
import { winstonLogger } from '@ohjobber/shared';
import { reviewConfig } from '@review/config';
import { Channel } from 'amqplib';
import { createRabbitMQConnection } from '@review/queues/connection';

const log: Logger = winstonLogger(`${reviewConfig.ELASTIC_SEARCH_URL}`, 'reviewServiceProducer', 'debug');

const publishFanoutMessage = async (channel: Channel, exchangeName: string, message: string, logMessage: string): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createRabbitMQConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'fanout');
    channel.publish(exchangeName, '', Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'ReviewService publishFanoutMessage() method error', error);
  }
};

export { publishFanoutMessage };
