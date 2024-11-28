const amqp = require('amqplib');
const logger = require('./logger');

class Queue {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URI);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(process.env.QUEUE_NAME, { durable: true });
            logger.info('Connected to RabbitMQ');
        } catch (error) {
            logger.error('Error connecting to RabbitMQ', { error });
        }
    }

    async sendMessage(message) {
        try {
            this.channel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(message), { persistent: true });
            logger.info('Message sent to queue', { message });
        } catch (error) {
            logger.error('Error sending message to queue', { message, error });
        }
    }

    async consumeMessages(callback) {
        try {
            this.channel.consume(process.env.QUEUE_NAME, async (msg) => {
                if (msg !== null) {
                    await callback(msg.content.toString());
                    this.channel.ack(msg);
                }
            });
            logger.info('Started consuming messages');
        } catch (error) {
            logger.error('Error consuming messages', { error });
        }
    }
}

module.exports = Queue; 