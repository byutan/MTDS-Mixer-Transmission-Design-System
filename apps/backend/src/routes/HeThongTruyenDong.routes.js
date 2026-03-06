import express from 'express';
import { tinhHieuSuat, tinhTySoTruyenChungSoBo } from '../controllers/HeThongTruyenDong.controller.js';

const router = express.Router();
router.post("/tinh-cong-suat-can-thiet", tinhHieuSuat)
router.post("/tinh-ty-so-truyen-chung-so-bo", tinhTySoTruyenChungSoBo)

export default router 