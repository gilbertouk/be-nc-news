# Northcoders News API

### How to initialize this project

This repository uses the npm dotenv package to store some environment variables, to run this project you need to create two files `.env.test` and `.env.development` in the root folder of this project, and inside each file it should contain the following environment variable `PGDATABASE=` with the names of both database.

For the `.env.test` file it should look like this:

`PGDATABASE=nc_news_test`

For the `.env.development` file it should look like this:

`PGDATABASE=nc_news`