const apiRouter = require('express').Router();
const topicsRouter = require('./topics.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const usersRouter = require('./users.router');

const endpoints = require('../endpoints.json');

apiRouter.get('/', (req, res) => {
  res.status(200).send({ endpoints });
});

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

apiRouter.use((req, res) => {
  res.status(404).send({ msg: 'Not found' });
});

module.exports = apiRouter;
