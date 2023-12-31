const {
  selectCommentsByArticleId,
  insertArticleComment,
  deleteComment,
  updateComment,
} = require('../models/comments.models');
const { selectArticleById } = require('../models/articles.models');

const getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  const promises = [
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id, limit, p),
  ];

  Promise.all(promises)
    .then((data) => {
      res.status(200).send({ comments: data[1] });
    })
    .catch((err) => {
      next(err);
    });
};

const postArticleComment = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;

  insertArticleComment(article_id, body)
    .then((data) => {
      res.status(201).send({ comment: data });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

const patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getAllCommentsByArticleId,
  postArticleComment,
  deleteCommentById,
  patchCommentById,
};
