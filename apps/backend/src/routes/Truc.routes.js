import express from 'express';
import { tinhBangDuongKinhTruc_I } from '../controllers/Truc.controller.js';

const router = express.Router();
router.post('/tinh-bang-duong-kinh-Truc-I', tinhBangDuongKinhTruc_I);

export default router;
