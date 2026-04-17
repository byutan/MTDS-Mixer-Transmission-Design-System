import express from 'express';
import { tinhHieuSuat,
    tinhTySoTruyenChungSoBo,
    tinhTySoTruyenChungThucTe,
    tinhBangDacTinhKyThuat,
    tinhThongSoBoTruyenDaiThang,
    tinhThongSoBoTruyenBanhRangTru } from '../controllers/HeThongTruyenDong.controller.js';

const router = express.Router();
router.post("/tinh-hieu-suat", tinhHieuSuat)
router.post("/tinh-ty-so-truyen-chung-so-bo", tinhTySoTruyenChungSoBo)
router.post("/tinh-ty-so-truyen-chung-thuc-te", tinhTySoTruyenChungThucTe)
router.post("/tinh-bang-dac-tinh-ky-thuat", tinhBangDacTinhKyThuat)
router.post("/tinh-thong-so-bo-truyen-dai-thang", tinhThongSoBoTruyenDaiThang)
router.post("/tinh-thong-so-bo-truyen-banh-rang-tru", tinhThongSoBoTruyenBanhRangTru)

export default router 