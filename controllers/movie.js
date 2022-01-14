const movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');

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
        next(new BadRequest('Ошибка при создании фильма'));
      } else {
        next(err);
      }
    });
};
module.exports.deleteMovie = (req, res, next) => {
  movie
    .findById(req.params.movieId)
    .orFail(new NotFound('Нет фильма по заданному id'))
    .then((item) => {
      if (req.user._id !== item.owner.toString()) {
        next(new Error('Нельзя удалять чужие фильмы!'));
      } else {
        item.remove();
        res.status(200).send({ message: 'Фильм успешно удален!' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет фильма по заданному id'));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res) => {
  movie
    .find({ owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении фильмов' }));
};
