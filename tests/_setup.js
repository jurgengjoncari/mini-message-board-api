const {MongoMemoryServer} = require('mongodb-memory-server'),
  {connectToDB, disconnectDB} = require('../config/db');

global.app = require('../app');
global.request = require('supertest');

beforeAll(async () => {
  global.mongod = await MongoMemoryServer.create();
  await connectToDB(mongod.getUri());
})

afterAll(async () => {
  await disconnectDB();
  await mongod.stop();
})
