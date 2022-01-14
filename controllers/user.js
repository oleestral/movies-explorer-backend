const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((item) => {
      if (!item) {
        next(new NotFound('Нет пользователя по заданному id'));
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный id пользователя'));
      } else {
        next(err);
      }
    });
};
module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      email,
      name,
    },
    { new: true, runValidators: true },
  )
    .orFail(new NotFound('Нет пользователя по заданному id'))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет пользователя по заданному id'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Данные некорректны'));
      } else {
        next(err);
      }
    });
};
module.exports.registration = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((userEmail) => {
      if (userEmail) {
        next(new Conflict('Пользователь с таким email уже существует'));
      }
      bcrypt
        .hash(password, 10)
        .then(
          (hash) => User.create({
            name,
            email,
            password: hash,
          }),
        )
        .then((data) => {
          res.status(200).send({ _id: data.id, email: data.email });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest('Данные некорректны'));
          } else {
            next(err);
          }
        });
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Неправильные почта или пароль'));
      } else {
        bcrypt
          .compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw (new Error('Неправильные почта или пароль'));
            } else {
              const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
              return res.status(200).send({ token });
            }
          })
          .catch(next);
      }
    });
};
