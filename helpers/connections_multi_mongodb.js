const mongoose = require("mongoose");
require("dotenv").config();

function newConnection(uri) {
  const conn = mongoose.createConnection(uri);

  conn.on('connected', function () {
    console.log(`Mongodb::: connected::: ${this.name}`);
  })

  conn.on('disconnected', function () {
    console.log(`Mongodb::: disconnected::: ${this.name}`);
  });

  conn.on('error', function (error) {
    console.log(`Mongodb::: error::: ${JSON.stringify(error)}`);
  });

  process.on('SIGINT', async () => {
    await conn.close();
    process.exit(0);
  });

  return conn;
}

const testConnection = newConnection(process.env.URI_MONGODB_TEST);

module.exports = { testConnection };

