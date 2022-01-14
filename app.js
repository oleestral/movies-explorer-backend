const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const router = require('./routes/index');
const errorHandler = require('./middlewares/error');
const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
app.use(requestLogger);
app.use(cors);

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);
app.use((req, res, next) => {
  next(new NotFound('Ресурс не найден'));
});
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
