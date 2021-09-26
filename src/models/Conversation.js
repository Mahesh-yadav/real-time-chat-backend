import { ObjectId } from 'mongodb';
import { db } from '../db/connection';
import User from './User';

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

  static async getConversationById(id) {
    const database = db.getDb();

    const conversation = await database
      .collection(Conversation.collectionName)
      .findOne({
        _id: ObjectId(id),
      });

    const members = await Promise.all(
      conversation.memberIds.map((id) => User.getUser(id))
    );

    const populatedMessages = conversation.messages.map((message) => ({
      ...message,
      postedBy: members.find((member) => member.id === message.postedById),
    }));

    const populatedConversation = {
      ...conversation,
      messages: populatedMessages,
      members,
    };

    return populatedConversation;
  }

  static async addMessageToConversation(messageText, userId, conversationId) {
    const database = db.getDb();

    await database.collection(Conversation.collectionName).updateOne(
      {
        _id: ObjectId(conversationId),
      },
      {
        $push: {
          messages: {
            _id: new ObjectId(),
            text: messageText,
            postedById: userId,
          },
        },
      }
    );
  }
}
