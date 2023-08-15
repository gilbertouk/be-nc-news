const { selectCommentsByArticleId } = require('../models/comments.models');
const { selectArticleById } = require('../models/articles.models');

const getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id),
  ];

  Promise.all(promises)
    .then((data) => {
      res.status(200).send({ comments: data[1] });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllCommentsByArticleId };
