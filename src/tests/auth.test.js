import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/User.js';

describe('Auth API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('POST /api/auth/register - Register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ 
        email: 'test@example.com',
        password: 'password123',
        role: 'owner'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
  });
});