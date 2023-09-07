const db = require('../db/connection');

const selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Resource not found' });
      }

      return rows[0];
    });
};

const selectAllArticles = (
  topic,
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  p = 1
) => {
  let baseSqlString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id `;

  let totalCountBaseSqlString = `SELECT COUNT(article_id) FROM articles `;

  const arrQuery = [];

  const sort_byFilter = [
    'author',
    'title',
    'article_id',
    'topic',
    'created_at',
    'votes',
    'article_img_url',
    'comment_count'
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
    totalCountBaseSqlString += `WHERE topic = $1 `;
    arrQuery.push(topic);
  }

  if (Number.isNaN(+limit)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  if (Number.isNaN(+p)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  baseSqlString += `GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${
    limit * (p - 1)
  };`;

  const articles = { total_count: 0 };

  return db
    .query(totalCountBaseSqlString, arrQuery)
    .then(({ rows }) => {
      articles.total_count = +rows[0].count; // - +limit;
      return;
    })
    .then(() => {
      return db.query(baseSqlString, arrQuery);
    })
    .then(({ rows }) => {
      articles.articles = rows;
      return articles;
    });
};

const updateArticle = (article_id, data) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [data.inc_votes, article_id]
    )
    .then((rows) => {
      if (rows.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'Resource not found' });
      }

      return rows.rows[0];
    });
};

const insertArticle = (author, title, body, topic, article_img_url) => {
  let baseSqlString = `INSERT INTO articles 
  (author, title, body, topic`;

  const arrQuery = [author, title, body, topic];

  if (article_img_url) {
    arrQuery.push(article_img_url);
    baseSqlString += `, article_img_url`;
  }

  baseSqlString += `) 
  VALUES 
  ($1, $2, $3, $4`;

  if (article_img_url) {
    baseSqlString += `, $5`;
  }

  baseSqlString += ') RETURNING *';

  return db.query(baseSqlString, arrQuery).then(({ rows }) => {
    rows[0].comment_count = 0;

    return rows[0];
  });
};

const deleteArticle = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1`, [article_id])
    .then((rows) => {
      if (rows.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'Resource not found' });
      }
      return;
    });
};

module.exports = {
  selectArticleById,
  selectAllArticles,
  updateArticle,
  insertArticle,
  deleteArticle,
};
