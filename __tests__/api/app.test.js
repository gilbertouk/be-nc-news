const request = require('supertest');
const app = require('../../app');
const seedTestData = require('../../db/data/test-data');
const seed = require('../../db/seeds/seed');
const db = require('../../db/connection');
const endpoints = require('../../endpoints.json');

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(seedTestData);
});

describe('Testing app', () => {
  describe('All /invalid-path', () => {
    test('404: should return status 404 when given any invalid path', () => {
      return request(app)
        .get('/api/invalid-path')
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe('Not found');
        });
    });
  });

  describe('Endpoint /api/topics', () => {
    describe('Method GET', () => {
      test('GET: 200 status', () => {
        return request(app).get('/api/topics').expect(200);
      });

      test('GET: 200 status with all topics data and properties', () => {
        return request(app)
          .get('/api/topics')
          .then(({ body }) => {
            const { topics } = body;
            const expectTopics = [
              { slug: 'mitch', description: 'The man, the Mitch, the legend' },
              { slug: 'cats', description: 'Not dogs' },
              { slug: 'paper', description: 'what books are made of' },
            ];

            expect(Array.isArray(topics)).toBe(true);
            expect(topics).toHaveLength(3);
            expect(topics).toMatchObject(expectTopics);
          });
      });
    });

    describe('Method POST', () => {
      test('POST: 201 status', () => {
        return request(app)
          .post('/api/topics')
          .send({
            slug: 'game',
            description: 'about videogames',
          })
          .expect(201);
      });

      test('POST: 201 status respond with a topic object containing the newly added topic', () => {
        return request(app)
          .post('/api/topics')
          .send({
            slug: 'game',
            description: 'about videogames',
          })
          .then(({ body }) => {
            const { topic } = body;

            expect(topic).toEqual({
              slug: 'game',
              description: 'about videogames',
            });
          });
      });

      test('POST: 201 status respond with a topic object containing the newly added topic ignored extras properties on request body', () => {
        return request(app)
          .post('/api/topics')
          .send({
            slug: 'game',
            description: 'about videogames',
            extra: true,
            topic_id: 18,
          })
          .then(({ body }) => {
            const { topic } = body;

            expect(topic).toEqual({
              slug: 'game',
              description: 'about videogames',
            });
          });
      });

      test('POST: 400 status respond when given empty request body', () => {
        return request(app)
          .post('/api/topics')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('POST: 400 status respond when not given slug property on request body', () => {
        return request(app)
          .post('/api/topics')
          .send({ description: 'about videogames' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('POST: 400 status respond when not given description property on request body', () => {
        return request(app)
          .post('/api/topics')
          .send({ slug: 'game' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });
  });

  describe('Endpoint /api', () => {
    describe('Method GET', () => {
      test('GET: 200 status', () => {
        return request(app).get('/api').expect(200);
      });

      test('GET: 200 responds with an object describing all the available endpoints on your API', () => {
        return request(app)
          .get('/api')
          .then(({ body }) => {
            const apiEndpoints = body.endpoints;

            expect(apiEndpoints.constructor === Object).toBe(true);
            expect(apiEndpoints).toEqual(endpoints);
          });
      });
    });
  });

  describe('Endpoint /api/articles/:article_id', () => {
    describe('Method GET', () => {
      test('GET: 200 status', () => {
        return request(app).get('/api/articles/1').expect(200);
      });

      test('GET: 200 status responds with an article object data', () => {
        return request(app)
          .get('/api/articles/1')
          .then(({ body }) => {
            const { article } = body;

            const expectArticle = {
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2020-07-09T20:11:00.000Z',
              votes: 100,
              article_img_url:
                'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            };

            expect(article).toMatchObject(expectArticle);
          });
      });

      test('GET: 404 status when given article_id does not exist', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('GET: 400 status when given invalid article_id', () => {
        return request(app)
          .get('/api/articles/invalid_id')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('GET: 200 status responds with an article object data with comment_count property', () => {
        return request(app)
          .get('/api/articles/1')
          .then(({ body }) => {
            const { article } = body;

            expect(article).toHaveProperty('comment_count', '11');
          });
      });
    });

    describe('Method PATCH', () => {
      test('PATCH: 200 status', () => {
        return request(app)
          .patch('/api/articles/3')
          .send({ inc_votes: 1 })
          .expect(200);
      });

      test('PATCH: 200 status responds with the updated article', () => {
        return request(app)
          .patch('/api/articles/3')
          .send({ inc_votes: 20 })
          .then(({ body }) => {
            const { article } = body;
            const expectArticle = {
              article_id: 3,
              title: 'Eight pug gifs that remind me of mitch',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'some gifs',
              created_at: article.created_at,
              votes: 20,
              article_img_url:
                'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            };

            expect(article).toMatchObject(expectArticle);
          });
      });

      test('PATCH: 200 status responds with the updated article when given negative inc_vote ', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -10 })
          .then(({ body }) => {
            const { article } = body;
            const expectArticle = {
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: article.created_at,
              votes: 90,
              article_img_url:
                'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            };

            expect(article).toMatchObject(expectArticle);
          });
      });

      test('PATCH: 200 status responds with the updated article and ignored extra properties on the request body', () => {
        return request(app)
          .patch('/api/articles/3')
          .send({ inc_votes: 1, body: 'test', isMonday: true })
          .then(({ body }) => {
            const { article } = body;
            const expectArticle = {
              article_id: 3,
              title: 'Eight pug gifs that remind me of mitch',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'some gifs',
              created_at: article.created_at,
              votes: 1,
              article_img_url:
                'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            };

            expect(article).toMatchObject(expectArticle);
            expect(article).not.toContainKey('isMonday');
          });
      });

      test('PATCH: 404 status when given article_id does not exist e.g /api/articles/300', () => {
        return request(app)
          .patch('/api/articles/300')
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('PATCH: 400 status when given invalid article_id e.g /api/articles/invalid', () => {
        return request(app)
          .patch('/api/articles/invalid')
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('PATCH: 400 status when given valid article_id but invalid request body', () => {
        return request(app)
          .patch('/api/articles/3')
          .send({ inc_votes: 'string' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('PATCH: 400 status when given valid article_id but empty request body', () => {
        return request(app)
          .patch('/api/articles/3')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });

    describe('Method DELETE', () => {
      test('DELETE: 204 status', () => {
        return request(app)
          .delete('/api/articles/1')
          .expect(204)
          .then(() => {
            return db.query('SELECT * FROM comments WHERE article_id = 1');
          })
          .then(({ rows }) => {
            expect(rows.length).toBe(0);
            return;
          })
          .then(() => {
            return db.query('SELECT * FROM articles WHERE article_id = 1');
          })
          .then(({ rows }) => {
            expect(rows.length).toBe(0);
          });
      });

      test('DELETE: 404 status when given article_id does not exist e.g /api/articles/999', () => {
        return request(app)
          .delete('/api/articles/999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('DELETE: 400 status when given invalid article_id e.g /api/articles/abc', () => {
        return request(app)
          .delete('/api/articles/abc')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });
  });

  describe('Endpoint /api/articles', () => {
    describe('Method GET', () => {
      test('GET: 200 status', () => {
        return request(app).get('/api/articles').expect(200);
      });

      test('GET: 200 status responds with an articles array of article objects', () => {
        return request(app)
          .get('/api/articles')
          .then(({ body }) => {
            const { articles } = body;

            expect(articles).toHaveLength(10);

            articles.forEach((article) => {
              expect(article).toHaveProperty('author', expect.any(String));
              expect(article).toHaveProperty('title', expect.any(String));
              expect(article).toHaveProperty('article_id', expect.any(Number));
              expect(article).toHaveProperty('topic', expect.any(String));
              expect(article).toHaveProperty('created_at');
              expect(new Date(article.created_at)).toBeDate();
              expect(article).toHaveProperty('votes', expect.any(Number));
              expect(article).toHaveProperty(
                'article_img_url',
                expect.any(String)
              );
              expect(article).toHaveProperty(
                'comment_count',
                expect.any(String)
              );
            });
          });
      });

      test('GET: 200 status responds with the articles should be sorted by date in descending order', () => {
        return request(app)
          .get('/api/articles')
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy('created_at', { descending: true });
          });
      });

      test('GET: 200 status responds and there should not be a body property present on any of the article objects', () => {
        return request(app)
          .get('/api/articles')
          .then(({ body }) => {
            const { articles } = body;

            expect(articles).toHaveLength(10);

            articles.forEach((article) => {
              expect(article).not.toContainKey('body');
            });
          });
      });

      test('GET: 200 status and should also accept the queries to filter the articles by topic e.g /api/articles?topic=cats', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .then(({ body }) => {
            const { articles } = body;
            const expectArticles = [
              {
                author: 'rogersop',
                title: 'UNCOVERED: catspiracy to bring down democracy',
                article_id: 5,
                topic: 'cats',
                created_at: '2020-08-03T13:14:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '2',
              },
            ];

            expect(articles).toEqual(expectArticles);
          });
      });

      test('GET: 200 status and should also accept the queries to filter the articles by topic e.g /api/articles?topic=mitch', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .then(({ body }) => {
            const { articles } = body;

            expect(articles).toHaveLength(10);
            articles.forEach((article) => {
              expect(article).toHaveProperty('topic', 'mitch');
            });
            expect(articles).toBeSortedBy('created_at', { descending: true });
          });
      });

      test('GET: 200 status and should also accept the queries to sort_by, which sorts the articles by any valid column(author, title, article_id, topic, created_at, votes, article_img_url) (defaults to date)', () => {
        return request(app)
          .get('/api/articles?topic=mitch&sort_by=article_id')
          .then(({ body }) => {
            const { articles } = body;

            expect(articles).toBeSortedBy('article_id', { descending: true });
          });
      });

      test('GET: 400 status when given invalid column instead of (author, title, article_id, topic, created_at, votes, article_img_url) (defaults to date)', () => {
        return request(app)
          .get('/api/articles?sort_by=other-column-name')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid sort query');
          });
      });

      test('GET: 200 status responds with articles order ascending by title', () => {
        return request(app)
          .get('/api/articles?sort_by=title&order=asc')
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy('title', { descending: false });
          });
      });

      test('GET: 400 status when given invalid order instead of asc or desc', () => {
        return request(app)
          .get('/api/articles?order=other')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid order query');
          });
      });

      test('GET: 200 status responds with correct articles data by given queries', () => {
        return request(app)
          .get('/api/articles?sort_by=title&order=asc&topic=mitch')
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy('title', { descending: false });
            expect(articles).toHaveLength(10);
            articles.forEach((article) => {
              expect(article).toHaveProperty('topic', 'mitch');
            });
          });
      });

      test('GET: 200 status responds with correct articles data by given limit query', () => {
        return request(app)
          .get('/api/articles?limit=8')
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(8);
          });
      });

      test('GET: 200 status responds with correct articles data by default limit 10', () => {
        return request(app)
          .get('/api/articles')
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(10);
          });
      });

      test('GET: 400 status responds when given query limit not a number e.g /api/articles?limit=string', () => {
        return request(app)
          .get('/api/articles?limit=string')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('GET: 200 status responds with the correct articles when given query pages e.g /api/articles?sort_by=article_id&order=asc&p=2', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id&order=asc&p=2')
          .then(({ body }) => {
            const { articles } = body;
            const expectArticles = [
              {
                author: 'icellusedkars',
                title: 'Am I a cat?',
                article_id: 11,
                topic: 'mitch',
                created_at: '2020-01-15T22:21:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                author: 'butter_bridge',
                title: 'Moustache',
                article_id: 12,
                topic: 'mitch',
                created_at: '2020-10-11T11:24:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                author: 'butter_bridge',
                title: 'Another article about Mitch',
                article_id: 13,
                topic: 'mitch',
                created_at: '2020-10-11T11:24:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
            ];
            expect(articles).toEqual(expectArticles);
          });
      });

      test('GET: 200 status responds with the correct articles when given query pages and limit e.g /api/articles?p=2&limit=5', () => {
        return request(app)
          .get('/api/articles?p=2&limit=5')
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(5);
          });
      });

      test('GET: 400 status responds when given query page not a number e.g /api/articles?p=string', () => {
        return request(app)
          .get('/api/articles?p=string')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('GET: 200 status responds with total_count property, displaying the total number of articles', () => {
        return request(app)
          .get('/api/articles')
          .then(({ body }) => {
            expect(body).toHaveProperty('total_count', 13);
          });
      });

      test('GET: 200 status responds with total_count property correct when given limit query', () => {
        return request(app)
          .get('/api/articles?limit=5')
          .then(({ body }) => {
            expect(body).toHaveProperty('total_count', 13);
          });
      });
    });

    describe('Method POST', () => {
      test('POST: 201 status', () => {
        return request(app)
          .post('/api/articles')
          .send({
            author: 'butter_bridge',
            title: 'Article test',
            body: 'test article for northcoders API',
            topic: 'paper',
            article_img_url:
              'https://static.vecteezy.com/ti/fotos-gratis/p1/1961329-pilha-de-jornais-gratis-foto.jpg',
          })
          .expect(201);
      });

      test('POST: 201 status with the newly added article', () => {
        return request(app)
          .post('/api/articles')
          .send({
            author: 'butter_bridge',
            title: 'Article test',
            body: 'test article for northcoders API',
            topic: 'paper',
            article_img_url:
              'https://static.vecteezy.com/ti/fotos-gratis/p1/1961329-pilha-de-jornais-gratis-foto.jpg',
          })
          .then(({ body }) => {
            const { article } = body;
            const expectArticle = {
              author: 'butter_bridge',
              title: 'Article test',
              body: 'test article for northcoders API',
              topic: 'paper',
              article_img_url:
                'https://static.vecteezy.com/ti/fotos-gratis/p1/1961329-pilha-de-jornais-gratis-foto.jpg',
              article_id: 14,
              votes: 0,
              created_at: article.created_at,
              comment_count: 0,
            };

            expect(article).toEqual(expectArticle);
          });
      });

      test('POST: 201 status with the newly added article with default article_img_url', () => {
        return request(app)
          .post('/api/articles')
          .send({
            author: 'butter_bridge',
            title: 'Article test',
            body: 'test article for northcoders API',
            topic: 'paper',
          })
          .then(({ body }) => {
            const { article } = body;
            const expectArticle = {
              author: 'butter_bridge',
              title: 'Article test',
              body: 'test article for northcoders API',
              topic: 'paper',
              article_img_url:
                'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
              article_id: 14,
              votes: 0,
              created_at: article.created_at,
              comment_count: 0,
            };

            expect(article).toEqual(expectArticle);
          });
      });

      test('POST: 201 status with the newly added article and ignored extra properties on the request body', () => {
        return request(app)
          .post('/api/articles')
          .send({
            author: 'butter_bridge',
            title: 'Article test',
            body: 'test article for northcoders API',
            topic: 'paper',
            extra1: 'test',
            extra2: 23,
            extra3: false,
          })
          .then(({ body }) => {
            const { article } = body;
            const expectArticle = {
              author: 'butter_bridge',
              title: 'Article test',
              body: 'test article for northcoders API',
              topic: 'paper',
              article_img_url:
                'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
              article_id: 14,
              votes: 0,
              created_at: article.created_at,
              comment_count: 0,
            };

            expect(article).toEqual(expectArticle);
          });
      });

      test('POST: 404 status when given author does not exists e.g john_kenny', () => {
        return request(app)
          .post('/api/articles')
          .send({
            author: 'john_kenny',
            title: 'Article test',
            body: 'test article for northcoders API',
            topic: 'paper',
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('POST: 404 status when given topic does not exists e.g test', () => {
        return request(app)
          .post('/api/articles')
          .send({
            author: 'butter_bridge',
            title: 'Article test',
            body: 'test article for northcoders API',
            topic: 'test',
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('POST: 400 status when given empty request body', () => {
        return request(app)
          .post('/api/articles')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('POST: 400 status when not given body property in request body', () => {
        return request(app)
          .post('/api/articles')
          .send({
            author: 'butter_bridge',
            title: 'Article test',
            topic: 'paper',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('POST: 400 status when not given title property in request body', () => {
        return request(app)
          .post('/api/articles')
          .send({
            author: 'butter_bridge',
            body: 'test article for northcoders API',
            topic: 'paper',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });
  });

  describe('Endpoint /api/articles/:article_id/comments', () => {
    describe('Method GET', () => {
      test('GET: 200 status', () => {
        return request(app).get('/api/articles/1/comments').expect(200);
      });

      test('GET: 200 status responds with an array of comments for the given article_id of which each comment', () => {
        return request(app)
          .get('/api/articles/3/comments')
          .then(({ body }) => {
            const { comments } = body;
            const expectComments = [
              {
                comment_id: 11,
                votes: 0,
                created_at: '2020-09-19T23:10:00.000Z',
                author: 'icellusedkars',
                body: 'Ambidextrous marsupial',
                article_id: 3,
              },
              {
                comment_id: 10,
                votes: 0,
                created_at: '2020-06-20T07:24:00.000Z',
                author: 'icellusedkars',
                body: 'git push origin master',
                article_id: 3,
              },
            ];

            expect(comments).toHaveLength(2);
            expect(comments).toMatchObject(expectComments);
          });
      });

      test('GET: 200 status responds and comments should be served with the most recent comments first.', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .then(({ body }) => {
            const { comments } = body;

            expect(comments).toHaveLength(10);
            expect(comments).toBeSortedBy('created_at', { descending: true });
          });
      });

      test('GET: 200 status responds whit an empty array when there are no comments for the article', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;

            expect(comments).toEqual([]);
          });
      });

      test('GET: 404 status when given article_id does not exist', () => {
        return request(app)
          .get('/api/articles/500/comments')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('GET: 400 status when given invalid article_id', () => {
        return request(app)
          .get('/api/articles/invalid-id/comments')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('GET: 200 status responds with correct article comments data by given limit query', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=8')
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toHaveLength(8);
          });
      });

      test('GET: 200 status responds with correct article comments data by default limit 10', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toHaveLength(10);
          });
      });

      test('GET: 400 status responds when given query limit not a number e.g /api/articles/1/comments?limit=string', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=string')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('GET: 200 status responds with the correct article comments when given query pages 1 e.g /api/articles/1/comments?limit=5&p=1', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5&p=1')
          .then(({ body }) => {
            const { comments } = body;
            const expectComments = [
              {
                comment_id: 5,
                votes: 0,
                created_at: '2020-11-03T21:00:00.000Z',
                author: 'icellusedkars',
                body: 'I hate streaming noses',
                article_id: 1,
              },
              {
                comment_id: 2,
                votes: 14,
                created_at: '2020-10-31T03:03:00.000Z',
                author: 'butter_bridge',
                body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                article_id: 1,
              },
              {
                comment_id: 18,
                votes: 16,
                created_at: '2020-07-21T00:20:00.000Z',
                author: 'butter_bridge',
                body: 'This morning, I showered for nine minutes.',
                article_id: 1,
              },
              {
                comment_id: 13,
                votes: 0,
                created_at: '2020-06-15T10:25:00.000Z',
                author: 'icellusedkars',
                body: 'Fruit pastilles',
                article_id: 1,
              },
              {
                comment_id: 7,
                votes: 0,
                created_at: '2020-05-15T20:19:00.000Z',
                author: 'icellusedkars',
                body: 'Lobster pot',
                article_id: 1,
              },
            ];
            expect(comments).toEqual(expectComments);
          });
      });

      test('GET: 200 status responds with the correct article comments when given query pages 2 e.g /api/articles/1/comments?limit=5&p=2', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5&p=2')
          .then(({ body }) => {
            const { comments } = body;
            const expectComments = [
              {
                comment_id: 5,
                votes: 0,
                created_at: '2020-11-03T21:00:00.000Z',
                author: 'icellusedkars',
                body: 'I hate streaming noses',
                article_id: 1,
              },
              {
                comment_id: 2,
                votes: 14,
                created_at: '2020-10-31T03:03:00.000Z',
                author: 'butter_bridge',
                body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                article_id: 1,
              },
              {
                comment_id: 18,
                votes: 16,
                created_at: '2020-07-21T00:20:00.000Z',
                author: 'butter_bridge',
                body: 'This morning, I showered for nine minutes.',
                article_id: 1,
              },
              {
                comment_id: 13,
                votes: 0,
                created_at: '2020-06-15T10:25:00.000Z',
                author: 'icellusedkars',
                body: 'Fruit pastilles',
                article_id: 1,
              },
              {
                comment_id: 7,
                votes: 0,
                created_at: '2020-05-15T20:19:00.000Z',
                author: 'icellusedkars',
                body: 'Lobster pot',
                article_id: 1,
              },
            ];
            expect(comments).not.toEqual(expectComments);
          });
      });

      test('GET: 400 status responds when given query page not a number e.g /api/articles/1/comments?limit=5&p=string', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5&p=string')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });

    describe('Method POST', () => {
      test('POST: 201 status', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'rogersop', body: 'comment test' })
          .expect(201);
      });

      test('POST: 201 status responds wih the posted comment', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'rogersop', body: 'comment test' })
          .then(({ body }) => {
            const { comment } = body;

            const expectComment = {
              comment_id: 19,
              body: 'comment test',
              article_id: 2,
              author: 'rogersop',
              votes: 0,
              created_at: comment.created_at,
            };

            expect(comment).toMatchObject(expectComment);
          });
      });

      test('POST: 201 status responds wih the posted comment and ignored extra properties on the request body', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({
            username: 'rogersop',
            body: 'Other comment test',
            key: 'banana',
          })
          .then(({ body }) => {
            const { comment } = body;

            const expectComment = {
              comment_id: 19,
              body: 'Other comment test',
              article_id: 2,
              author: 'rogersop',
              votes: 0,
              created_at: comment.created_at,
            };

            expect(comment).not.toContainKey('key');
            expect(comment).toMatchObject(expectComment);
          });
      });

      test('POST: 404 status when given article_id does not exist e.g 999', () => {
        return request(app)
          .post('/api/articles/999/comments')
          .send({ username: 'rogersop', body: 'comment test' })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('POST: 400 status when given invalid article_id e.g /api/articles/invalid/comments', () => {
        return request(app)
          .post('/api/articles/invalid/comments')
          .send({ username: 'rogersop', body: 'comment test' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('POST: 400 status when given empty comment data', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('POST: 404 status when given incorrect comment data (username that is not in our users database)', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'test', body: 'test' })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('POST: 400 status when given valid article_id and invalid body property', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'rogersop' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });
  });

  describe('Endpoint /api/comments/:comment_id', () => {
    describe('Method DELETE', () => {
      test('DELETE: 204 status', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204)
          .then(() => {
            return db.query('SELECT * FROM comments WHERE comment_id = 1');
          })
          .then(({ rows }) => {
            expect(rows.length).toBe(0);
          });
      });

      test('DELETE: 404 status when given comment_id does not exist e.g /api/comments/999', () => {
        return request(app)
          .delete('/api/comments/999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('DELETE: 400 status when given invalid comment_id e.g /api/comments/ab', () => {
        return request(app)
          .delete('/api/comments/ab')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });

    describe('Method PATCH', () => {
      test('PATCH: 200 status', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 1 })
          .expect(200);
      });

      test('PATCH: 200 status responds with the updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 4 })
          .then(({ body }) => {
            const { comment } = body;
            const expectComment = {
              article_id: 9,
              author: 'butter_bridge',
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              comment_id: 1,
              created_at: '2020-04-06T12:17:00.000Z',
              votes: 20,
            };

            expect(comment).toEqual(expectComment);
          });
      });

      test('PATCH: 200 status responds with the updated comment when given negative inc_votes', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: -20 })
          .then(({ body }) => {
            const { comment } = body;
            const expectComment = {
              article_id: 9,
              author: 'butter_bridge',
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              comment_id: 1,
              created_at: '2020-04-06T12:17:00.000Z',
              votes: -4,
            };

            expect(comment).toEqual(expectComment);
          });
      });

      test('PATCH: 200 status responds with the updated comment and ignored extra properties on the request body', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 20, body: 'test update', isFalse: true })
          .then(({ body }) => {
            const { comment } = body;
            const expectComment = {
              article_id: 9,
              author: 'butter_bridge',
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              comment_id: 1,
              created_at: '2020-04-06T12:17:00.000Z',
              votes: 36,
            };

            expect(comment).toEqual(expectComment);
            expect(comment).not.toContainKey('isFalse');
          });
      });

      test('PATCH: 404 status when given comment_id does not exist e.g /api/comments/999', () => {
        return request(app)
          .patch('/api/comments/999')
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });

      test('PATCH: 400 status when given invalid comment_id e.g /api/comments/abc', () => {
        return request(app)
          .patch('/api/comments/abc')
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('PATCH: 400 status when given valid comment_id but invalid request body', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 'string' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      test('PATCH: 400 status when given valid comment_id but empty request body', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });
  });

  describe('Endpoint /api/users', () => {
    describe('Method GET', () => {
      test('GET: 200 status', () => {
        return request(app).get('/api/users').expect(200);
      });

      test('GET: 200 status with all users data and properties', () => {
        return request(app)
          .get('/api/users')
          .then(({ body }) => {
            const { users } = body;
            const expectUsers = [
              {
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url:
                  'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
              },
              {
                username: 'icellusedkars',
                name: 'sam',
                avatar_url:
                  'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
              },
              {
                username: 'rogersop',
                name: 'paul',
                avatar_url:
                  'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
              },
              {
                username: 'lurker',
                name: 'do_nothing',
                avatar_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              },
            ];

            expect(users).toEqual(expectUsers);
          });
      });
    });
  });

  describe('Endpoint /api/users/:username', () => {
    describe('Method GET', () => {
      test('GET: 200 status', () => {
        return request(app).get('/api/users/icellusedkars').expect(200);
      });

      test('GET: 200 status responds with a user object', () => {
        return request(app)
          .get('/api/users/icellusedkars')
          .then(({ body }) => {
            const { user } = body;
            expectUser = [
              {
                avatar_url:
                  'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
                name: 'sam',
                username: 'icellusedkars',
              },
            ];

            expect(user).toEqual(expectUser);
          });
      });

      test('GET: 404 status responds with err msg when given a username that is not in the database', () => {
        return request(app)
          .get('/api/users/test')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Resource not found');
          });
      });
    });
  });
});
