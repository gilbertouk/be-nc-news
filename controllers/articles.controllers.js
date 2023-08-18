const {
  selectArticleById,
  selectAllArticles,
  updateArticle,
  insertArticle,
  deleteArticle,
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
  const { topic, sort_by, order, limit, p } = req.query;
  selectAllArticles(topic, sort_by, order, limit, p)
    .then((data) => {
      res
        .status(200)
        .send({ articles: data.articles, total_count: data.total_count });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticle = (req, res, next) => {
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

const postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticlesById,
  getAllArticles,
  patchArticle,
  postArticle,
  deleteArticleById,
};
