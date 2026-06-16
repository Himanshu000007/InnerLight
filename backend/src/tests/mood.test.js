import request from 'supertest';
import app from '../app.js';

describe('Mood Endpoints', () => {
  let token;
  let userId;

  // Setup before tests
  beforeAll(async () => {
    // Login or create test user
    // Get token for authenticated requests
  });

  describe('POST /moods', () => {
    it('should create a mood entry', async () => {
      const response = await request(app)
        .post('/api/v1/moods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mood: 'happy',
          moodScore: 4,
          intensity: 'medium',
          energy: 8,
          sleep: 7,
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('_id');
    });

    it('should fail without authentication', async () => {
      const response = await request(app).post('/api/v1/moods').send({
        mood: 'happy',
        moodScore: 4,
      });

      expect(response.status).toBe(401);
    });

    it('should fail with invalid mood', async () => {
      const response = await request(app)
        .post('/api/v1/moods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mood: 'invalid',
          moodScore: 4,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /moods/history', () => {
    it('should get mood history', async () => {
      const response = await request(app)
        .get('/api/v1/moods/history')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /moods/analytics', () => {
    it('should get mood analytics', async () => {
      const response = await request(app)
        .get('/api/v1/moods/analytics?days=30')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('totalEntries');
      expect(response.body.data).toHaveProperty('moodCounts');
    });
  });
});