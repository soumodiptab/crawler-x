const mongoose = require('mongoose');

class MongoDB {
    constructor() {
        if (!MongoDB.instance) {
            mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            MongoDB.instance = this;
        }
        return MongoDB.instance;
    }

    getConnection() {
        return mongoose.connection;
    }
}

module.exports = MongoDB; 