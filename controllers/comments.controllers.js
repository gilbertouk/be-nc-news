const { selectCommentsByArticleId } = require('../models/comments.models');

const getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllCommentsByArticleId };
