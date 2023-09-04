const cors = require('cors');
const express = require('express');
const {
  handleCustomErrors,
  handleDatabaseErrors,
} = require('./controllers/errors.controllers');

const app = express();
app.use(cors());

const apiRouter = require('./routes');

app.use(express.json());
app.use('/api', apiRouter);

app.use(handleDatabaseErrors);

app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send();
});

module.exports = app;
