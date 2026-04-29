const mongoose = require('mongoose');
const env = require('dotenv')

env.config();


console.log('MongoDB URL:', process.env.mongodbURL);

const connectDB = async ()=>{
    try {
      const conn =  await mongoose.connect(process.env.mongodbURL);
        console.log(`Mongodb connect ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

module.exports = {connectDB};