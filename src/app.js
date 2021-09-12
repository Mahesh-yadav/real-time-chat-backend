import express from 'express';
import morgan from 'morgan';

const app = express();

// Logging middleware
app.use(morgan('dev'));

// JSON req body parser middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello!')
})

export default app;