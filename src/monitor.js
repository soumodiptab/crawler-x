const client = require('prom-client');

// Collect default metrics
client.collectDefaultMetrics();

// Custom metrics
const crawlCounter = new client.Counter({
    name: 'crawl_requests_total',
    help: 'Total number of crawl requests',
});

const errorCounter = new client.Counter({
    name: 'crawl_errors_total',
    help: 'Total number of crawl errors',
});

const retryCounter = new client.Counter({
    name: 'retry_requests_total',
    help: 'Total number of retry requests',
});

const messageProcessedCounter = new client.Counter({
    name: 'messages_processed_total',
    help: 'Total number of messages processed',
});

const classificationCounter = new client.Counter({
    name: 'classification_requests_total',
    help: 'Total number of classification requests',
});

const classificationErrorCounter = new client.Counter({
    name: 'classification_errors_total',
    help: 'Total number of classification errors',
});

function incrementCrawlCounter() {
    crawlCounter.inc();
}

function incrementErrorCounter() {
    errorCounter.inc();
}

function incrementRetryCounter() {
    retryCounter.inc();
}

function incrementMessageProcessedCounter() {
    messageProcessedCounter.inc();
}

function incrementClassificationCounter() {
    classificationCounter.inc();
}

function incrementClassificationErrorCounter() {
    classificationErrorCounter.inc();
}

function exposeMetrics(app) {
    app.get('/metrics', async (req, res) => {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    });
}

module.exports = {
    incrementCrawlCounter,
    incrementErrorCounter,
    incrementRetryCounter,
    incrementMessageProcessedCounter,
    incrementClassificationCounter,
    incrementClassificationErrorCounter,
    exposeMetrics,
}; 