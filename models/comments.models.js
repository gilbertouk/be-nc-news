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

const deleteComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then((rows) => {
      if (rows.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'Resource not found' });
      }

      return;
    });
};

module.exports = { selectCommentsByArticleId, deleteComment };
