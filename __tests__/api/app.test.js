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
          .expect(200)
          .then(({ body }) => {
            const topics = body;
            expect(Array.isArray(topics)).toBe(true);

            topics.forEach((item) => {
              expect(item).toHaveProperty('slug', expect.any(String));
              expect(item).toHaveProperty('description', expect.any(String));
            });
          });
      });

      test('GET: 404 status with msg Not Found when given a wrong endpoint', () => {
        return request(app)
          .get('/api/topicsss')
          .expect(404)
          .then(({ res }) => {
            expect(res.statusMessage).toBe('Not Found');
          });
      });
    });
  });
});
