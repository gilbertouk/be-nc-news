const express = require('express');
const { getAllTopics } = require('./controllers/topics.controllers');
const {
  getArticlesById,
  getAllArticles,
} = require('./controllers/articles.controllers');
const {
  getAllCommentsByArticleId,
  deleteCommentById,
} = require('./controllers/comments.controllers');
const endpoints = require('./endpoints.json');

const app = express();

app.get('/api', (req, res) => {
  res.status(200).send({ endpoints });
});

app.get('/api/topics', getAllTopics);
app.get('/api/articles/:article_id', getArticlesById);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id/comments', getAllCommentsByArticleId);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.use((req, res) => {
  res.status(404).send({ msg: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send();
});

module.exports = app;
