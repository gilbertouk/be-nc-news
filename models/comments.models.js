const db = require('../db/connection');

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      'SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;',
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const insertArticleComment = (article_id, data) => {
  const { username, body } = data;

  if (Object.keys(data).length === 0) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  if (username === undefined) {
    return Promise.reject({ status: 404, msg: 'Resource not found' });
  }

  if (body === undefined) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  return db
    .query(
      `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { selectCommentsByArticleId, insertArticleComment };
