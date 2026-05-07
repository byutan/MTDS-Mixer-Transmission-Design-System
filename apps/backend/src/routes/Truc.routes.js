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

//=====================================================================
// TÍNH TOÁN D1, LMRC, LMDT VỚI LỰA CHỌN CỦA USER
//=====================================================================
router.get('/tinh-dieu-kien-d1-truc-I', truccontroller.tinhDieuKienD1_trucI)
router.get('/tinh-dieu-kien-d2-truc-II', truccontroller.tinhDieuKienD1_trucII)
router.get('/tinh-dieu-kien-d3-truc-III', truccontroller.tinhDieuKienD1_trucIII)

// TÍNH HỆ SỐ TRỤC
router.post('/tinh-he-truc-I', truccontroller.tinh_hetruc_trucI)
router.post('/tinh-he-truc-II', truccontroller.tinh_hetruc_trucII)
router.post('/tinh-he-truc-III', truccontroller.tinh_hetruc_trucIII)
// suport front end
// Trục I
router.get('/show-gh-truc-I', truccontroller.gioi_han_lmrc_lmdt_truc_I)
router.get('/show-gh-l11-truc-I', truccontroller.gioi_han_l11_I)
// Trục II
router.get('/show-gh-truc-II', truccontroller.gioi_han_lmrc_lmrt_II)
// Trục III
router.get('/show-gh-truc-III', truccontroller.gioi_han_lmrt_lmkn_III)
export default router;
