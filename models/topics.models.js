const db = require('../db/connection');

const selectTopics = () => {
  return db.query('SELECT * FROM topics').then(({ rows }) => {
    return rows;
  });
};

const insertTopic = (slug, description) => {
  if (description === undefined) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { selectTopics, insertTopic };
