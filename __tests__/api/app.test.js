const request = require('supertest');
const app = require('../../app');
const seedTestData = require('../../db/data/test-data');
const seed = require('../../db/seeds/seed');
const db = require('../../db/connection');

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
            expect(Array.isArray(topics)).toBe(true);
            expect(topics).toHaveLength(3);

            topics.forEach((item) => {
              expect(item).toHaveProperty('slug', expect.any(String));
              expect(item).toHaveProperty('description', expect.any(String));
            });
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

  describe('Endpoint /api/articles/:article_id', () => {
    describe('Method GET', () => {
      test('GET: 200 status', () => {
        return request(app).get('/api/articles/1').expect(200);
      });

      test('GET: 200 status responds with an article object data', () => {
        return request(app)
          .get('/api/articles/1')
          .then(({ body }) => {
            const article = body;

            // expect(article).toHaveProperty();
          });
      });
    });
  });
});
