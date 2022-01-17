const { celebrate, Joi } = require('celebrate');

const userRouter = require('express').Router();

const {
  getCurrentUser,
  updateUserInfo,
} = require('../controllers/user');

userRouter.get('/users/me', getCurrentUser);
userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().min(2),
    }),
  }),
  updateUserInfo,
);

module.exports = userRouter;
