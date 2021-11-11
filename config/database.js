const mongoose = require('mongoose');
require('dotenv').config()

let dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (err) {
        console.log(`Cannot connect to the DB ${err}`);
    }
}

dbConnection()

let db = mongoose.connection;

db.on('open', () => {
    console.log(`DB connected on port ${db.port}`);
})
