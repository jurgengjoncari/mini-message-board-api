const
  app = require('../../app'),
  request = require('supertest'),
  {messages} = require('../../models/db');

test('GET / returns all messages', async () => {
  const res = await request(app).get('/');

  expect(res.statusCode).toBe(200);
  expect(res.text).toContain('Mini Message board');
  expect(res.text).toContain('Hi there!');
  expect(res.text).toContain('Hello World!');
});

test('POST /new creates a new message', async () => {
  const res = await request(app)
    .post('/new')
    .send({
      message: 'This is a test message',
      author: 'Test Author'
    });

  const lastMessage = messages[messages.length - 1];

  expect(res.statusCode).toBe(302);
  expect(messages.length).toBeGreaterThan(2);
  expect(lastMessage.text).toBe('This is a test message');
  expect(lastMessage.author).toBe('Test Author');
});
