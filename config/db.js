import mongoose from 'mongoose';

let db, client;

export {
  connectToDB,
  disconnectDB
};

/**
 * Connect to MongoDB
 * @param {string} uri - The MongoDB connection string
 * @returns {Promise<mongoose.Connection>} - The connected database instance
 * @throws {Error} - Throws an error if the connection fails
 */
async function connectToDB(uri) {
  if (db) return db;
  try {
    client = await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    return db;
  }
  catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

/**
 * Close the MongoDB connection
 */
async function disconnectDB() {
  if (client) {
    await client.connection.close();
    db = null;
  }
}
