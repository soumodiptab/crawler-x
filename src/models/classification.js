const mongoose = require('mongoose');

const classificationSchema = new mongoose.Schema({
    metadataId: { type: mongoose.Schema.Types.ObjectId, ref: 'Metadata', required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Classification = mongoose.model('Classification', classificationSchema);

module.exports = Classification; 