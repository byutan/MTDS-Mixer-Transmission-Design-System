import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Running server at port ${PORT}`);
});