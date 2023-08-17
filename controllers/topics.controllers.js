const { selectTopics, insertTopic } = require('../models/topics.models');

const getAllTopics = (req, res) => {
  selectTopics().then((data) => {
    res.status(200).send({ topics: data });
  });
};

const postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  insertTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllTopics, postTopic };
