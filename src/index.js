import './config';
import app from './app';
import { db } from './db/connection';

const PORT = process.env.PORT || 4000;
const DB_URL = process.env.MONGODB_CONNECTION_URI;

async function start() {
  await db.connect(DB_URL);

  app.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT} ...`);
  });
}

start();
