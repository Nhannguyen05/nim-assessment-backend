const mongoose = require("mongoose");
const getLogger = require("../logger");

const logger = getLogger("db");

const { MONGO_URI, DB_NAME, DB_PASSWORD } = process.env;
const connectionString = MONGO_URI;
const password = DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://${DB_NAME}:${password}@${connectionString}/?retryWrites=true&w=majority`
  )
  .then(() => {
    logger.log("Connected to MongoDB");
  })
  .catch((error) => logger.error(error.message));

module.exports = mongoose;
