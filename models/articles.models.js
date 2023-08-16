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

const selectAllArticles = (topic, sort_by = 'created_at', order = 'desc') => {
  let baseSqlString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const arrQuery = [];

  const sort_byFilter = [
    'author',
    'title',
    'article_id',
    'topic',
    'created_at',
    'votes',
    'article_img_url',
  ];
  if (!sort_byFilter.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort query' });
  }

  const orderFilter = ['desc', 'asc'];
  if (!orderFilter.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  if (topic) {
    baseSqlString += `WHERE articles.topic = $1 `;
    arrQuery.push(topic);
  }

  baseSqlString += `GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order};`;

  return db.query(baseSqlString, arrQuery).then(({ rows }) => {
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
