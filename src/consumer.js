require('dotenv').config();
const Queue = require('./queue');
const CrawlService = require('./services/crawlService');
const InsightService = require('./services/insightService');
const { incrementMessageProcessedCounter } = require('./monitor');
const logger = require('./logger');

(async () => {
    // Initialize queues
    const mainQueue = new Queue(process.env.QUEUE_NAME);
    const retryQueue = new Queue(process.env.RETRY_QUEUE_NAME);
    const insightQueue = new Queue(process.env.INSIGHT_QUEUE_NAME);

    // Connect to queues
    await mainQueue.connect();
    await retryQueue.connect();
    await insightQueue.connect();

    // Initialize services
    const crawlService = new CrawlService();
    const insightService = new InsightService();

    // Process messages for crawling
    const processCrawlMessage = async (msg) => {
        const { url, retries } = JSON.parse(msg.content.toString());
        await crawlService.crawl(url, retries);
        incrementMessageProcessedCounter();
    };

    // Process messages for insights
    const processInsightMessage = async (msg) => {
        const { metadataId } = JSON.parse(msg.content.toString());
        await insightService.classifyMetadata(metadataId);
        incrementMessageProcessedCounter();
    };

    // Consume messages from queues
    mainQueue.consumeMessages(processCrawlMessage);
    retryQueue.consumeMessages(processCrawlMessage);
    insightQueue.consumeMessages(processInsightMessage);

    logger.info('All consumers started');
})(); 