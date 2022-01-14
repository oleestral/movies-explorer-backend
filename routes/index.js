const router = require('express').Router();

const userRouter = require('./user');
const movieRouter = require('./movie');

router.use('/', userRouter);
router.use('/', movieRouter);

module.exports = router;
