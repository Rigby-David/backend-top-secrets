const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
  password: '12345',
};

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;
    
//   const agent = request.agent(app);
    
//   const user = await UserService.create({ ...mockUser, ...userProps });
    
//   const { email } = user;
//   await agent.post('/api/v1/users/sessions').send({ email, password });
//   return [agent, user];
// };

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });
  it('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app).post('/api/v1/users/sessions').send({ email: 'test@test.com', password: '12345' });
    expect(res.status).toEqual(200);
  });
  // it('should sign out a user', async () => {
  //   const [agent] = await registerAndLogin();
  //   const res = await agent.delete('api/v1/users/sessions');
  //   expect(res.status).toBe(204);
  // });
  afterAll(() => {
    pool.end();
  });
});
