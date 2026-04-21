import express from 'express';
import { register, login, getStats } from '../controllers/user.controller.js';

const router = express.Router();
router.post('/signup', register);
router.post('/login', login);
router.get('/stats/:student_id', getStats);

export default router;