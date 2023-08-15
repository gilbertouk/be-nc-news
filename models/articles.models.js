const db = require('../db/connection');

const selectArticleById = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Resource not found' });
      }

      return rows[0];
    });
};

const selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const updateArticle = (article_id, data) => {
  return db
    .query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [
      data.inc_votes,
      article_id,
    ])
    .then((rows) => {
      if (rows.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'Resource not found' });
      }

      return rows.rows[0];
    });
};

module.exports = { selectArticleById, selectAllArticles, updateArticle };
