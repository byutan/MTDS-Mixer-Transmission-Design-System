import express from 'express';
import { tinhHieuSuat, tinhTySoTruyenChungSoBo, tinhTySoTruyenChungThucTe, tinhBangDacTinhKyThuat } from '../controllers/HeThongTruyenDong.controller.js';

const router = express.Router();
router.post("/tinh-hieu-suat", tinhHieuSuat)
router.post("/tinh-ty-so-truyen-chung-so-bo", tinhTySoTruyenChungSoBo)
router.post("/tinh-ty-so-truyen-chung-thuc-te", tinhTySoTruyenChungThucTe)
router.post("/tinh-bang-dac-tinh-ky-thuat", tinhBangDacTinhKyThuat)

export default router 