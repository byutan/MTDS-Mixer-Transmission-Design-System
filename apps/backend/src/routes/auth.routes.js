import express from 'express';
import { register, login } from '../controllers/user.controller.js';

const router = express.Router();

// Đường dẫn sẽ là: http://localhost:3001/api/auth/signup
router.post('/signup', register);
router.post('/login', login);

export default router;