import express from 'express';
import { tinhHieuSuat } from '../controllers/HopGiamToc.controller.js';

const router = express.Router();
router.post("/tinh-hieu-suat", tinhHieuSuat)

export default router 