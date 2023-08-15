const request = require('supertest');
const app = require('../../app');
const seedTestData = require('../../db/data/test-data');
const seed = require('../../db/seeds/seed');
const db = require('../../db/connection');
const endpoints = require('../../endpoints.json');
const { expect } = require('@jest/globals');

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

            expect(articles).toHaveLength(13);

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

            expect(articles).toHaveLength(13);

            articles.forEach((article) => {
              expect(article).not.toContainKey('body');
            });
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

            expect(comments).toHaveLength(11);
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
          .send({ username: 'test' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });
  });
});
