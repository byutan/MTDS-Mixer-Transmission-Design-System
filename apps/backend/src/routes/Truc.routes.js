import express from 'express';
import * as truccontroller from '../controllers/Truc.controller.js';

const router = express.Router();
// Trục I
router.post('/tinh-bang-duong-kinh-Truc-I', truccontroller.tinhBangDuongKinhTruc_I)
// Trục II
router.post('/tinh-bang-duong-kinh-Truc-II', truccontroller.tinhBangDuongKinh_trucII)
// Trục III
router.post('/tinh-bang-duong-kinh-Truc-III', truccontroller.tinhBangDuongKinh_trucIII)

// bảng 4.5
router.post('/tinh-bang-4-5-truc-I', truccontroller.tinhBang_4_5_truc_I)
router.post('/tinh-bang-4-5-truc-II',truccontroller.tinhBang_4_5_truc_II )
router.post('/tinh-bang-4-5-truc-III',truccontroller.tinhBang_4_5_truc_III )

// bảng 4.6 - Kiểm nghiệm hệ số an toàn mỏi
router.post('/kiemnghiem-heso-antoan-truc-I', truccontroller.kiemnghiemHesoAnToa_trucI)
router.post('/kiemnghiem-heso-antoan-truc-II', truccontroller.kiemnghiemHesoAnToa_trucII)
router.post('/kiemnghiem-heso-antoan-truc-III', truccontroller.kiemnghiemHesoAnToa_trucIII)
// bảng kiểm nghiệm đồ bền quá tải các trục
router.post('/kiemnghiem-doben-quatai-truc-I', truccontroller.Kiemnghiemdobenquatai_trucI)
router.post('/kiemnghiem-doben-quatai-truc-II', truccontroller.Kiemnghiemdobenquatai_trucII)
router.post('/kiemnghiem-doben-quatai-truc-III', truccontroller.Kiemnghiemdobenquatai_trucIII)
export default router;
