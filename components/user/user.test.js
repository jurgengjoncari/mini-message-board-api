const User = require('./user.model');

test('POST /user creates a new user', async () => {
  const data = {
    username: 'testuser',
    email: 'testuser@email.com',
    password: 'Password123!'
  };
  const res = await request(app)
    .post('/users')
    .send(data);
  expect(res.statusCode).toBe(200);
  expect(res.body.username).toBe(data.username);
  expect(res.body._id).toBeDefined();
  expect(res.body.createdAt).toBeDefined();
  const user = await User.findOne({username: data.username});
  expect(user).toBeDefined();
});
