import express from 'express';
import { tinhToanOLanTheoTruc } from '../controllers/OLan.controller.js';

const router = express.Router();

router.post('/tinh-toan-truc/:id', tinhToanOLanTheoTruc);

export default router;