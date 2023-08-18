const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.statusCode === 400 && err.type === 'entity.parse.failed') {
    res.status(err.status).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
};

const handleDatabaseErrors = (err, req, res, next) => {
  if (err.code === '22P02' || err.code === '23502') {
    res.status(400).send({ msg: 'Bad request' });
  } else if (err.code === '23503') {
    res.status(404).send({ msg: 'Resource not found' });
  } else {
    next(err);
  }
};

module.exports = { handleCustomErrors, handleDatabaseErrors };
