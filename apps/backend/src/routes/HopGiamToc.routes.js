import express from 'express';
import { tinhHieuSuat, tinhTySoTruyenThucTe, phanPhoiTySoTruyenCapBanhRang } from '../controllers/HopGiamToc.controller.js';

const router = express.Router();
router.post("/tinh-hieu-suat", tinhHieuSuat)
router.post("/tinh-ty-so-truyen-thuc-te", tinhTySoTruyenThucTe)
router.post("/phan-phoi-ty-so-truyen-banh-rang", phanPhoiTySoTruyenCapBanhRang)

export default router 