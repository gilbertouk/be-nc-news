const usersRouter = require('express').Router();

const {
  getAllUsers,
  getUsersByUsername,
} = require('../controllers/users.controllers');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:username', getUsersByUsername);

module.exports = usersRouter;
