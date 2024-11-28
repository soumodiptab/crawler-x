const axios = require('axios');
const schedule = require('node-schedule');
const logger = require('../logger');
const Queue = require('../queue');
const { incrementRetryCounter } = require('../monitor');

class FetchService {
    constructor() {
        this.retryDelay = 10000; // 10 seconds
        this.maxRetries = 3;
        this.retryQueue = new Queue(process.env.RETRY_QUEUE_NAME);
        this.recyclerQueue = new Queue(process.env.RECYCLER_QUEUE_NAME);
    }

    async fetchPage(url, retries = 0) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                if (retries < this.maxRetries) {
                    logger.warn(`Rate limit hit for ${url}. Scheduling retry...`);
                    this.scheduleRetry(url, retries + 1);
                    incrementRetryCounter();
                } else {
                    logger.error(`Max retries reached for ${url}. Moving to recycler queue.`);
                    await this.recyclerQueue.sendMessage(url);
                }
            } else {
                logger.error(`Error fetching ${url}:`, error);
            }
            return null;
        }
    }

    scheduleRetry(url, retries) {
        const retryTime = new Date(Date.now() + this.retryDelay);
        schedule.scheduleJob(retryTime, async () => {
            logger.info(`Retrying ${url}, attempt ${retries}`);
            await this.retryQueue.sendMessage(JSON.stringify({ url, retries }));
        });
    }
}

module.exports = FetchService; 