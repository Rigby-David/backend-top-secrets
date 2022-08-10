const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
    
  const agent = request.agent(app);
    
  const user = await UserService.create({ ...mockUser, ...userProps });
    
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('/secrets should return 401 if not auth', async () => {
    const res = await request(app).get('/api/v1/secrets');
    expect(res.status).toEqual(401);
  });
  it('/secrets should return a list of secrets for auth user', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toBe(200);        
  });
  it('#POST should add a new secret is user is logged in', async () => {
    const newSecret = {
      title: 'Tell me the secret',
      description: 'Pigs can look up'
    };
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/secrets').send(newSecret);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      ...newSecret
    });
  });
});
afterAll(() => {
  pool.end();
});
