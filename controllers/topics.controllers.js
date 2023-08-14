const { selectTopics } = require('../models/topics.models');

const getAllTopics = (req, res, next) => {
  selectTopics().then((data) => {
    res.status(200).send(data);
  });
};

module.exports = { getAllTopics };
