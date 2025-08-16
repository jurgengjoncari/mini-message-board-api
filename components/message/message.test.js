const User = require('../user/User'),
  Message = require('./Message');

const userData = { username: "alice", password: "hashedpassword" },
  messageData = { content: "Hello world" };

beforeEach(async () => {
  // Clear collections
  await User.deleteMany({});
  await Message.deleteMany({});

  // Insert test data
  const alice = await User.create(userData);
  await Message.create(Object.assign(messageData, { senderId: alice._id }));
});

test('Unauthenticated users can read messages', async () => {
  const res = await request(app)
    .get('/messages')
    .expect(200);

  expect(res.body).toBeDefined();
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0].content).toBe(messageData.content);
  expect(res.body[0].senderId).toBeDefined();
  expect(res.body[0].createdAt).toBeDefined();
});

test('Unauthenticated users cannot create messages', async () => {
  // Attempt to create a message without authentication
  await request(app)
    .post('/messages')
    .send(messageData)
    .expect(401);
});

test('Authenticated users can create messages', async () => {
  // First, log in
  let res = await request(app)
    .post('/auth/login')
    .send(userData)
    .expect(200);

  expect(res.body.token).toBeDefined();

  const token = res.body.token;

  // Now, create a message with the token
  const messageData = {
    content: 'This is a test message',
  };

  res = await request(app)
    .post('/messages')
    .set('Authorization', `Bearer ${token}`)
    .send(messageData)
    .expect(201);

  expect(res.body.content).toBe(messageData.content);
  expect(res.body._id).toBeDefined();
});
