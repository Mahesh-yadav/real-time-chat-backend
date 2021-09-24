import express from 'express';
import { protectRoute } from '../middlewares/protectRoute';
import Conversation from '../models/Conversation';

const router = express.Router();

router.use(protectRoute);

router.post('/', async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { name, memberIds } = req.body;

    const insertedId = await Conversation.createConversation(name, [
      ...memberIds,
      user_id,
    ]);

    res.status(201).json({ conversationId: insertedId });
  } catch (error) {
    next(error);
  }
});

export default router;
