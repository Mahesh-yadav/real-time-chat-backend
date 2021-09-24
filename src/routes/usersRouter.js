import express from 'express';
import { protectRoute } from '../middlewares/protectRoute';
import Conversation from '../models/Conversation';
import User from '../models/User';

const router = express.Router();

router.use(protectRoute);

router.get('/', async (req, res, next) => {
  try {
    const users = await User.getAllUsers();

    res.json({ data: users });
  } catch (error) {
    next(error);
  }
});

router.get('/:userId/conversations', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { user_id } = req.user;

    if (user_id !== userId) {
      return res.status(403).json({ message: 'Not Authorised' });
    }

    const conversations = await Conversation.getConversationsByUserId(userId);

    res.json({ data: conversations });
  } catch (error) {
    next(error);
  }
});

export default router;
