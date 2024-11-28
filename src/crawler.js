require('dotenv').config();
const Queue = require('./queue');
const CrawlService = require('./services/crawlService');
const { incrementMessageProcessedCounter } = require('./monitor');
const logger = require('./logger');

(async () => {
    const mainQueue = new Queue(process.env.QUEUE_NAME);
    const retryQueue = new Queue(process.env.RETRY_QUEUE_NAME);
    await mainQueue.connect();
    await retryQueue.connect();
    const crawlService = new CrawlService();

    const processMessage = async (msg) => {
        const { url, retries } = JSON.parse(msg.content.toString());
        await crawlService.crawl(url, retries);
        incrementMessageProcessedCounter();
    };

    mainQueue.consumeMessages(processMessage);
    retryQueue.consumeMessages(processMessage);

    logger.info('Queue processor started');
})(); 