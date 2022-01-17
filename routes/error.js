const router = require('express').Router();
const NotFound = require('../errors/NotFound');

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
