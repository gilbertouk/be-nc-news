const db = require('../db/connection');

const selectAllUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

const selectUserByUsername = (username) => {
  return db
    .query(
      `SELECT users.username, users.avatar_url, users.name FROM users WHERE users.username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Resource not found' });
      }
      return rows;
    });
};

module.exports = { selectAllUsers, selectUserByUsername };
