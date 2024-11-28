require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Queue = require('./queue');
const { exposeMetrics, incrementMessageProcessedCounter } = require('./monitor');
const logger = require('./logger');

const app = express();
const upload = multer({ dest: 'uploads/' });
const queue = new Queue();

(async () => {
    await queue.connect();

    app.post('/upload', upload.single('file'), (req, res) => {
        const filePath = req.file.path;
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                logger.error('Error reading file', { error: err });
                return res.status(500).send('Error reading file');
            }

            const urls = data.split('\n').filter(url => url.trim() !== '');
            urls.forEach(url => {
                queue.sendMessage(url.trim());
                incrementMessageProcessedCounter();
            });

            fs.unlink(filePath, (err) => {
                if (err) logger.error('Error deleting file', { error: err });
            });

            logger.info('URLs added to queue', { count: urls.length });
            res.send('URLs added to queue');
        });
    });

    exposeMetrics(app);

    app.listen(process.env.API_PORT, () => {
        logger.info(`API server running on port ${process.env.API_PORT}`);
    });
})(); 