const MongoDB = require('../db');
const Metadata = require('../models/metadata');
const CheerioParser = require('../parser');
const checkRobotsTxt = require('../robots');
const FetchService = require('./fetchService');
const { incrementCrawlCounter, incrementErrorCounter } = require('../monitor');
const logger = require('../logger');

class CrawlService {
    constructor() {
        this.fetchService = new FetchService();
        this.parser = new CheerioParser();
        this.db = new MongoDB();
    }

    async crawl(url, retries = 0) {
        incrementCrawlCounter();
        if (!(await checkRobotsTxt(url))) {
            logger.warn('Crawling disallowed by robots.txt', { url });
            return;
        }

        const html = await this.fetchService.fetchPage(url, retries);
        if (!html) {
            incrementErrorCounter();
            logger.error('Failed to fetch page', { url });
            return;
        }

        const metadata = this.parser.parse(html);

        this.db.getConnection().once('open', async () => {
            try {
                const metadataDoc = new Metadata({ url, ...metadata });
                await metadataDoc.save();
                logger.info('Crawled and stored metadata', { url });
            } catch (error) {
                incrementErrorCounter();
                logger.error('Error saving metadata', { url, error });
            }
        });
    }
}

module.exports = CrawlService; 