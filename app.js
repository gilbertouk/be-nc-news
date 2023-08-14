const express = require('express');
const { getAllTopics } = require('./controllers/topics.controllers');
const { getArticlesById } = require('./controllers/articles.controllers');
const endpoints = require('./endpoints.json');

const app = express();

app.get('/api', (req, res) => {
  res.status(200).send({ endpoints });
});

app.get('/api/topics', getAllTopics);
app.get('/api/articles/:article_id', getArticlesById);

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
