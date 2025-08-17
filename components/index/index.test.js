const User = require("../user/User");
const Message = require("../message/Message");

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

test.only('GET / returns all messages', async () => {
  const res = await request(app).get('/');

  expect(res.statusCode).toBe(200);
  expect(res.body[0].senderId.username).toBe(userData.username);
});

// test('POST /new creates a new message', async () => {
//   const res = await request(app)
//     .post('/new')
//     .send({
//       message: 'This is a test message',
//       author: 'Test Author'
//     });
//
//   const lastMessage = messages[messages.length - 1];
//
//   expect(res.statusCode).toBe(302);
//   expect(messages.length).toBeGreaterThan(2);
//   expect(lastMessage.text).toBe('This is a test message');
//   expect(lastMessage.author).toBe('Test Author');
// });
