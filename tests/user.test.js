const app = require('../app'),
  request = require('supertest'),
  {MongoMemoryServer} = require('mongodb-memory-server'),
  {connectToDB, disconnectDB} = require('../config/db'),
  User = require('../models/User');

beforeAll(async () => {
  global.mongod = await MongoMemoryServer.create();
  await connectToDB(mongod.getUri());
})

afterAll(async () => {
  await disconnectDB();
  await mongod.stop();
})

test('POST /user creates a new user', async () => {
  const data = {
    username: 'testuser',
    email: 'testuser@email.com'
  };
  const res = await request(app)
    .post('/users')
    .send(data);
  expect(res.statusCode).toBe(200);
  expect(res.body.username).toBe(data.username);
  expect(res.body.email).toBe(data.email);
  expect(res.body._id).toBeDefined();
  expect(res.body.creationDate).toBeDefined();
  const user = await User.findOne({username: data.username});
  expect(user).toBeDefined();
  expect(user.email).toBe(data.email);
});
