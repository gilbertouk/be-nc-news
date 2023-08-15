const {
  selectArticleById,
  selectAllArticles,
  updateArticle,
} = require('../models/articles.models');

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((data) => {
      res.status(200).send({ articles: data });
    })
    .catch((err) => {
      next(err);
    });
};

const pacthArticle = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;

  updateArticle(article_id, body)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticlesById, getAllArticles, pacthArticle };