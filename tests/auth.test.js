const User = require('../models/User');

const data = {
  username: 'testuser',
  password: 'Password123!'
};

test('POST /auth/signup', async () => {
  const res = await request(app)
    .post('/auth/signup')
    .send(data);
  expect(res.statusCode).toBe(200);
  expect(res.body.username).toBe(data.username);
  expect(res.body._id).toBeDefined();
  expect(res.body.createdAt).toBeDefined();
  expect(res.body.password).toBeUndefined(); // Password should not be returned

  const user = await User.findOne({username: data.username});
  expect(user).toBeDefined();
});

test('POST /auth/login', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send(data);
  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeDefined();
  expect(typeof res.body.token).toBe('string');
  expect(res.body.token.length).toBeGreaterThan(0);
});
