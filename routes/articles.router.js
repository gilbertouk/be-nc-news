const articlesRouter = require('express').Router();
const {
  getArticlesById,
  getAllArticles,
  patchArticle,
} = require('../controllers/articles.controllers');
const {
  getAllCommentsByArticleId,
  postArticleComment,
} = require('../controllers/comments.controllers');

articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id', getArticlesById);
articlesRouter.get('/:article_id/comments', getAllCommentsByArticleId);
articlesRouter.post('/:article_id/comments', postArticleComment);
articlesRouter.patch('/:article_id', patchArticle);

module.exports = articlesRouter;
