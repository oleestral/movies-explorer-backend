const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const router = require('./routes/index');
const errorHandler = require('./middlewares/error');
const notFoundError = require('./routes/error');

const { PORT = 3000, DATA_BASE = 'mongodb://localhost:27017/moviesdb', NODE_ENV } = process.env;

const app = express();
app.use(helmet());
app.use(requestLogger);
app.use(cors);

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.use(notFoundError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
