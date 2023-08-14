const { selectTopics } = require('../models/topics.models');

const getAllTopics = (req, res) => {
  selectTopics().then((data) => {
    res.status(200).send(data);
  });
};

module.exports = { getAllTopics };
