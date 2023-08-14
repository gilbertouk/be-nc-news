const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getArticlesById } = require("./controllers/articles.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send();
});

module.exports = app;
