

module.exports = {
    DB_NAME: process.env.DB_NAME || 'node-app-db',
    DB_DATABASE: process.env.DB_DATABASE || 'mongodb',
    DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb://127.0.0.1:27017/node-app-db',
};