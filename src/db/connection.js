import { MongoClient } from 'mongodb';

const DB_NAME = process.env.MONGODB_DATABASE_NAME;

export const db = {
  _dbClient: null,
  connect: async function (url) {
    const client = new MongoClient(url);

    this._dbClient = await client.connect();
  },
  getDb: function () {
    if (!this._dbClient) {
      console.log('You need to call .connect() first!');
      process.exit(1);
    }

    return this._dbClient.db(DB_NAME);
  },
};
