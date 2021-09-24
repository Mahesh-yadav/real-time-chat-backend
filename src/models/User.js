import { db } from '../db/connection';

export default class User {
  static collectionName = 'users';

  static async getAllUsers() {
    const users = db.getDb().collection(User.collectionName).find({}).toArray();

    return users;
  }
}
