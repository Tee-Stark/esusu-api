const mongoose = require('mongoose');
const logger = require('./logger');

const { MONGO_URI } = process.env;
module.exports = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('DB Connection Successful!');
  } catch (err) {
    logger.error('DB Connection Not Successful! 😫');
    process.exit(1);
  }
};
