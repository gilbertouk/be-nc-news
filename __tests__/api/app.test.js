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
  describe('Endpoint /api/topics', () => {
    describe('Method GET', () => {
      test('GET: 200 status', () => {
        return request(app).get('/api/topics').expect(200);
      });

      test('GET: 200 status with all topics data and properties', () => {
        return request(app)
          .get('/api/topics')
          .then(({ body }) => {
            const topics = body;
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

      test('GET: 404 status with msg Not Found when given a wrong endpoint', () => {
        return request(app)
          .get('/api/topicsss')
          .then(({ res }) => {
            expect(res.statusMessage).toBe('Not Found');
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
});
