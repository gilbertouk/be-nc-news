<h1 align="center"> Welcome to Northcoders News API 👋</h1>

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />  
</p>

> Northcoders News API: A direct outcome of the Northcoders bootcamp, we've developed a news API that serves as middleware to programmatically access and deliver data from our application. Inspired by the backend architecture of robust platforms, our API has been meticulously designed to enable seamless integration with the frontend architecture, empowering efficient and structured presentation of information to end users.

### Hosted version

Link to the hosted version of the API below with available endpoints.

> https://nc-news-api-ago9.onrender.com/api

## How to initialize this project

To run this project you need the following programs:

- Node: v18.16.1
- PostgreSQL: 15.3

Then follow the steps below:

<ol>
  <li>Clone this repository</li>
  <br>
  <li>Then you need to install the project's dependencies which you can look for in the `package.json` file.

Use your `npm` or `yarn` package managers to install dependencies

```sh
npm install
```

or

```sh
yarn install
```

</li>

  <li>
  
  This repository uses the npm dotenv package to store some environment variables, to run this project you need to create two files `.env.test` and `.env.development` in the root folder of this project, and inside each file it should contain the following environment variable `PGDATABASE=` with the names of both database.

For the `.env.test` file it should look like this:

`PGDATABASE=nc_news_test`

For the `.env.development` file it should look like this:

`PGDATABASE=nc_news`</li>

  <li>To create and seed the database, you need to run the script available in package.json in your terminal.

```sh
npm run setup-dbs
npm run seed
```

</li>

<li>To run the tests run the script below in the terminal

```sh
nm run seed
```

</li>
</ol>

## Author

👤 **Gilberto Silva**

- Github: [@gilbertouk](https://github.com/gilbertouk)
- LinkedIn: [@gilbertoantonio](https://linkedin.com/in/gilbertoantonio)

## Show your support

Give a ⭐️ if this project helped you!
