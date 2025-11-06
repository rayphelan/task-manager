'use strict';

require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./db');

const app = express();

const PORT = process.env.PORT || 3000;

async function start() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'task_manager_dev';
  await connectToDatabase({ uri, dbName });

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
}

module.exports = { app, start };


