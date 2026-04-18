import express from 'express';
import { tinhToanHinhHoc, getAll } from '../controllers/BanhRangCon.controller.js';

const router = express.Router();

router.post('/tinh-toan-hinh-hoc', tinhToanHinhHoc);
router.get('/', getAll);

export default router;