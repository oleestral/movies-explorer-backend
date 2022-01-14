const { celebrate, Joi } = require('celebrate');

const userRouter = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getCurrentUser,
  updateUserInfo,
  registration,
  login,
} = require('../controllers/user');

userRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
userRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  registration,
);

userRouter.get('/users/me', auth, getCurrentUser);
userRouter.patch(
  '/users/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().min(2),
    }),
  }),
  updateUserInfo,
);

module.exports = userRouter;
