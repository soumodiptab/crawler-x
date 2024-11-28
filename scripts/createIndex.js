require('dotenv').config();
const mongoose = require('mongoose');
const Metadata = require('../src/models/metadata');

async function createIndex() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Create an index on the 'url' field
        await Metadata.collection.createIndex({ url: 1 }, { unique: true });
        console.log('Index created on url field');

    } catch (error) {
        console.error('Error creating index:', error);
    } finally {
        mongoose.connection.close();
    }
}

createIndex();
