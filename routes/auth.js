const { celebrate, Joi } = require('celebrate');

const authRouter = require('express').Router();

const {
  registration,
  login,
} = require('../controllers/user');

authRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
authRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  registration,
);
module.exports = authRouter;
