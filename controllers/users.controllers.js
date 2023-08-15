const { selectAllUsers } = require('../models/users.models');

const getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((data) => {
      res.status(200).send({ users: data });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllUsers };
