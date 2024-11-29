const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    title: String,
    description: String,
    body: String,
    classificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classification' }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const Metadata = mongoose.model('Metadata', metadataSchema);

module.exports = Metadata; 