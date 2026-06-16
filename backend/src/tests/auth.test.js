import request from 'supertest';
import app from '../app.js';

describe('Auth Endpoints', () => {
  let token;
  let userId;

  describe('POST /auth/signup', () => {
    it('should signup a new user', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'TestPass123',
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body).toHaveProperty('userId');
      userId = response.body.userId;
    });

    it('should fail with existing email', async () => {
      await request(app).post('/api/v1/auth/signup').send({
        firstName: 'Test',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'TestPass123',
      });

      const response = await request(app).post('/api/v1/auth/signup').send({
        firstName: 'Test',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'TestPass123',
      });

      expect(response.status).toBe(400);
    });

    it('should fail with invalid email', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'TestPass123',
      });

      expect(response.status).toBe(400);
    });

    it('should fail with weak password', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'weak',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/send-otp', () => {
    it('should send OTP to email', async () => {
      const response = await request(app).post('/api/v1/auth/send-otp').send({
        email: 'test@example.com',
        firstName: 'Test',
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      // Create and verify user
      await request(app).post('/api/v1/auth/signup').send({
        firstName: 'Test',
        lastName: 'User',
        email: 'logintest@example.com',
        password: 'TestPass123',
      });

      // Mock email verification
      // In real scenario, you would get OTP from email
    });

    it('should fail with wrong password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'logintest@example.com',
        password: 'WrongPass123',
      });

      expect(response.status).toBe(401);
    });

    it('should fail with non-existent user', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'TestPass123',
      });

      expect(response.status).toBe(401);
    });
  });
});