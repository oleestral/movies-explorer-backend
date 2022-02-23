const movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Ошибка при создании фильма'));
      }
      return next(err);
    });
};
module.exports.deleteMovie = (req, res, next) => {
  movie
    .findById(req.params.id)
    .orFail(new NotFound('Нет фильма по заданному id'))
    .then((item) => {
      if (req.user._id === item.owner.toString()) {
        return item.remove().then(() => {
          res.status(200).send({ message: 'Фильм успешно удален!' });
        });
      }
      throw new Conflict('Нельзя удалять чужие фильмы!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет фильма по заданному id'));
      }
      next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  movie
    .find({ owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => next(err));
};
