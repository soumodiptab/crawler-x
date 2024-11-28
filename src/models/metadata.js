const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    title: String,
    description: String,
    body: String
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const Metadata = mongoose.model('Metadata', metadataSchema);

module.exports = Metadata; 