import { ObjectId } from 'mongodb';
import { db } from '../db/connection';
import Conversation from './Conversation';

export default class User {
  static collectionName = 'users';

  static async getAllUsers() {
    const users = await db
      .getDb()
      .collection(User.collectionName)
      .find({})
      .toArray();

    return users;
  }

  static async getUser(userId) {
    const user = await db.getDb().collection(User.collectionName).findOne({
      id: userId,
    });

    return user;
  }

  static async canAccessConversation(userId, conversationId) {
    const conversation = await db
      .getDb()
      .collection(Conversation.collectionName)
      .findOne({
        _id: ObjectId(conversationId),
      });

    return conversation.memberIds.includes(userId);
  }
}
