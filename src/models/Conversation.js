import { db } from '../db/connection';

export default class Conversation {
  static collectionName = 'conversations';

  static async getConversationsByUserId(userId) {
    const database = db.getDb();

    const conversations = await database
      .collection(Conversation.collectionName)
      .find({ memberIds: userId })
      .toArray();

    return conversations;
  }

  static async createConversation(name, memberIds) {
    const database = db.getDb();

    const result = await database
      .collection(Conversation.collectionName)
      .insertOne({
        name,
        memberIds,
        messages: [],
      });

    return result.insertedId;
  }
}
