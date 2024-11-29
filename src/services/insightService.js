require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const mongoose = require('mongoose');
const Metadata = require('../models/metadata');
const Classification = require('../models/classification');
const logger = require('../logger');
const { incrementClassificationCounter, incrementClassificationErrorCounter } = require('../monitor');

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class InsightService {
    constructor() {}

    async connectToDB() {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            logger.info('Connected to MongoDB for insights');
        }
    }

    async classifyMetadata(metadataId) {
        await this.connectToDB();

        const metadata = await Metadata.findById(metadataId);

        if (metadata) {
            try {
                incrementClassificationCounter();
                const category = await this.classifyText(metadata.title, metadata.description, metadata.body);
                const classification = new Classification({ metadataId, category });
                await classification.save();

                metadata.classificationId = classification._id;
                await metadata.save();

                logger.info('Classified document', { metadataId, category });
            } catch (error) {
                incrementClassificationErrorCounter();
                logger.error('Error classifying document', { metadataId, error });
            }
        }
    }

    async classifyText(title, description, body) {
        const prompt = `Classify the following content into a category: \nTitle: ${title}\nDescription: ${description}\nBody: ${body}\nCategory:`;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            max_tokens: 10,
        });

        return response.data.choices[0].text.trim();
    }
}

module.exports = InsightService; 