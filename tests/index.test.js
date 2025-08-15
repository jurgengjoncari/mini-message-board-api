const
  app = require('../app'),
  request = require('supertest'),
  {messages} = require('../db/db');

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

  expect(res.statusCode).toBe(302);
  expect(messages.length).toBeGreaterThan(2);
  expect(messages[messages.length - 1].text).toBe('This is a test message');
  expect(messages[messages.length - 1].author).toBe('Test Author');
});
