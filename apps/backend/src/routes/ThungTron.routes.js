import express from 'express';
import { tinhCongSuatCanThiet, tinhVongQuayCanThiet } from '../controllers/ThungTron.controller.js';

const router = express.Router();
router.post("/tinh-cong-suat-can-thiet", tinhCongSuatCanThiet)
router.post("/tinh-vong-quay-can-thiet", tinhVongQuayCanThiet)

export default router 