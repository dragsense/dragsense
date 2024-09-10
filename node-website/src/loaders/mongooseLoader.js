const mongoose = require('mongoose')

const { DatabaseConfig } = require("../config");

module.exports = async () => {
    try {
        await mongoose.connect(DatabaseConfig.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.info('Successfully for MongoDB connected!!')
    } catch (err) {
        console.error(`Failed to connect to MongoDB - ${err.message}`)
        throw new Error(`Failed to connect to MongoDB`)
    }
}
