require('dotenv').config();
const mongoose = require('mongoose');
const Metadata = require('./models/metadata');
const Queue = require('./queue');
const logger = require('./logger');

(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const queue = new Queue(process.env.INSIGHT_QUEUE_NAME);
    await queue.connect();

    const changeStream = Metadata.watch();

    changeStream.on('change', async (change) => {
        if (change.operationType === 'insert') {
            const metadataId = change.fullDocument._id;
            await queue.sendMessage(JSON.stringify({ metadataId }));
            logger.info('Enqueued new metadata for classification', { metadataId });
        }
    });

    logger.info('Watcher service started');
})(); 