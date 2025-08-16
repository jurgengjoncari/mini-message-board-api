const User = require('../user/User');

const data = {
  username: 'testuser',
  password: 'Password123!'
};

test('POST /auth/signup', async () => {
  const res = await request(app)
    .post('/auth/signup')
    .send(data);
  expect(res.statusCode).toBe(200);
  expect(res.body.user.username).toBe(data.username);
  expect(res.body.user._id).toBeDefined();
  expect(res.body.user.createdAt).toBeDefined();
  expect(res.body.user.password).toBeUndefined(); // Password should not be returned
  expect(res.body.token).toBeDefined();

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
