import express from 'express';
import { tinhHieuSuat, tinhTySoTruyenChungSoBo, tinhTySoTruyenChungThucTe } from '../controllers/HeThongTruyenDong.controller.js';

const router = express.Router();
router.post("/tinh-hieu-suat", tinhHieuSuat)
router.post("/tinh-ty-so-truyen-chung-so-bo", tinhTySoTruyenChungSoBo)
router.post("/tinh-ty-so-truyen-chung-thuc-te", tinhTySoTruyenChungThucTe)

export default router 