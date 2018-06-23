require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');

const app = express();
const router = express.Router();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;

mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}`, function () {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('App starting error', err.stack);
    process.exit(1);
  });

router.get('/', function (req, res) {
  res.json({ message: 'Welcome to Movie Rating API' });
});

const port = process.env.PORT || 8081;
app.use('/', router);
app.listen(port, function () {
  console.log(`API running on port ${port}`);
});
