import express from 'express';
import { tinhToanHinhHoc } from '../controllers/BanhRangCon.controller.js';

const router = express.Router();


router.post('/tinh-toan', tinhToanHinhHoc);

export default router;