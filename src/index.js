import './config';
import { Server as SocketIOServer } from 'socket.io';
import * as firebase from 'firebase-admin';
import http from 'http';
import app from './app';
import { db } from './db/connection';
import Conversation from './models/Conversation';
import User from './models/User';

const PORT = process.env.PORT || 4000;
const DB_URL = process.env.MONGODB_CONNECTION_URI;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POSt'],
  },
});

io.use(async (socket, next) => {
  if (!socket.handshake.query.token) {
    socket.emit('error', 'Not Authorised');
  } else {
    try {
      const user = await firebase
        .auth()
        .verifyIdToken(socket.handshake.query.token);

      socket.user = user;
      next();
    } catch (error) {
      socket.emit('error', 'Not Authorised');
    }
  }
});

io.on('connection', async (socket) => {
  console.log('A new client has connected');

  const { conversationId } = socket.handshake.query;

  const conversation = await Conversation.getConversationById(conversationId);

  socket.emit('conversation', conversation);

  socket.on('postMessage', async ({ text, conversationId }) => {
    const { user_id } = socket.user;

    const isUserAuthorised = await User.canAccessConversation(
      user_id,
      conversationId
    );

    if (isUserAuthorised) {
      await Conversation.addMessageToConversation(
        text,
        user_id,
        conversationId
      );

      const updatedConversation = await Conversation.getConversationById(
        conversationId
      );

      io.emit('messageUpdated', updatedConversation.messages);
    } else {
      socket.emit('error', 'Not Authorised');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

async function start() {
  await db.connect(DB_URL);

  server.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT} ...`);
  });
}

start();
