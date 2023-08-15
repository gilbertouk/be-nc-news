const { selectTopics } = require('../models/topics.models');

const getAllTopics = (req, res) => {
  selectTopics().then((data) => {
    res.status(200).send({ topics: data });
  });
};

module.exports = { getAllTopics };
