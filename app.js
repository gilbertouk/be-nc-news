const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const endpoints = require("./endpoints.json");
const app = express();

app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.get("/api/topics", getAllTopics);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send();
});

module.exports = app;
