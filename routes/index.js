const router = require('express').Router();

const userRouter = require('./user');
const movieRouter = require('./movie');
const authRouter = require('./auth');

const auth = require('../middlewares/auth');

const notFoundError = require('./error');

router.use('/', authRouter);

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);
router.use(notFoundError);

module.exports = router;
