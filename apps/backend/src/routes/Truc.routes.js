import express from 'express';
import { tinhBangDuongKinhTruc_I, tinhBangDuongKinh_trucII, tinhBangDuongKinh_trucIII} from '../controllers/Truc.controller.js';

const router = express.Router();
// Trục I
router.post('/tinh-bang-duong-kinh-Truc-I', tinhBangDuongKinhTruc_I);
router.post('/tinh-bang-duong-kinh-Truc-II', tinhBangDuongKinh_trucII)
router.post('/tinh-bang-duong-kinh-Truc-III', tinhBangDuongKinh_trucIII)
export default router;
