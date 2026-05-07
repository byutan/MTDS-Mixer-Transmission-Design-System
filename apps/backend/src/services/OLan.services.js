import { OLan } from "../models/OLan.js";
import { tinhBangDacTinhKyThuat } from "./HeThongTruyenDong.services.js";

// ==========================================
// TRỤC I
// ==========================================
export const tinhToanOLanTrucI = async (duLieuDauVao) => {
    const Lh = duLieuDauVao?.thungTron?.thoiGianPhucVu;
    if (!Lh) throw new Error("Missing service life (Lh) in mixer data.");

    const d_A = duLieuDauVao?.heThongTruyenDong?.truc?.dKinhTieuChuan?.trucI?.A;
    const d_B = duLieuDauVao?.heThongTruyenDong?.truc?.dKinhTieuChuan?.trucI?.B;
    if (!d_A || !d_B) throw new Error("Missing journal bearing diameter for position A or B.");

    // Lấy vận tốc động cơ từ JSON (n_dc = 2922)
    const n_truc1 = duLieuDauVao?.heThongTruyenDong?.dongCo?.vanTocQuay;
    if (!n_truc1) throw new Error("Missing motor speed (vanTocQuay) in JSON data.");

    const Fr_A = 4631.930; const Fa_A = 266.013;  
    const Fr_B = 2748.03;  const Fa_B = 0;        

    const heSo_kd = 1; 
    const oLanModel = new OLan();

    const ketQuaViTriA = oLanModel.tinhToanThietKeOLan({ duong_kinh_ngong_truc: d_A, Fr: Fr_A, Fa: Fa_A, so_vong_quay: n_truc1, thoi_gian_phuc_vu_Lh: Lh, he_so_tai_trong_dong_kd: heSo_kd });
    const ketQuaViTriB = oLanModel.tinhToanThietKeOLan({ duong_kinh_ngong_truc: d_B, Fr: Fr_B, Fa: Fa_B, so_vong_quay: n_truc1, thoi_gian_phuc_vu_Lh: Lh, he_so_tai_trong_dong_kd: heSo_kd });

    return { truc: "I", thong_so_chung: { so_vong_quay_n: n_truc1, thoi_gian_phuc_vu_Lh: Lh }, vi_tri_A: ketQuaViTriA, vi_tri_B: ketQuaViTriB };
};

// ==========================================
// TRỤC II
// ==========================================
export const tinhToanOLanTrucII = async (duLieuDauVao) => {
    const Lh = duLieuDauVao?.thungTron?.thoiGianPhucVu;
    if (!Lh) throw new Error("Missing service life (Lh) in mixer data.");

    const d_C = duLieuDauVao?.heThongTruyenDong?.truc?.dKinhTieuChuan?.trucII?.C;
    const d_D = duLieuDauVao?.heThongTruyenDong?.truc?.dKinhTieuChuan?.trucII?.D;
    if (!d_C || !d_D) throw new Error("Missing journal bearing diameter for position C or D.");

    // Lấy soVongQuay của Trục I (n1 = 812)
    const bangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao);
    const trucI = bangDacTinh.find(item => item.truc === 'I');
    if (!trucI) throw new Error("Cannot find data for Shaft I from kinematic table!");
    const n_truc2 = trucI.soVongQuay;

    const Fr_C = 5046.88; const Fa_C = 0; 
    const Fr_D = 2882.99; const Fa_D = 837.565;    

    const heSo_kd = 1; 
    const oLanModel = new OLan();

    const ketQuaViTriC = oLanModel.tinhToanThietKeOLan({ duong_kinh_ngong_truc: d_C, Fr: Fr_C, Fa: Fa_C, so_vong_quay: n_truc2, thoi_gian_phuc_vu_Lh: Lh, he_so_tai_trong_dong_kd: heSo_kd });
    const ketQuaViTriD = oLanModel.tinhToanThietKeOLan({ duong_kinh_ngong_truc: d_D, Fr: Fr_D, Fa: Fa_D, so_vong_quay: n_truc2, thoi_gian_phuc_vu_Lh: Lh, he_so_tai_trong_dong_kd: heSo_kd });

    return { truc: "II", thong_so_chung: { so_vong_quay_n: n_truc2, thoi_gian_phuc_vu_Lh: Lh }, vi_tri_C: ketQuaViTriC, vi_tri_D: ketQuaViTriD };
};

// ==========================================
// TRỤC III
// ==========================================
export const tinhToanOLanTrucIII = async (duLieuDauVao) => {
    const Lh = duLieuDauVao?.thungTron?.thoiGianPhucVu;
    if (!Lh) throw new Error("Missing service life (Lh) in mixer data.");

    
    const d_E = duLieuDauVao?.heThongTruyenDong?.truc?.dKinhTieuChuan?.trucIII?.E 
    const d_F = duLieuDauVao?.heThongTruyenDong?.truc?.dKinhTieuChuan?.trucIII?.F 

    // Lấy soVongQuay của Trục II (n2 = 258)
    const bangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao);
    const trucII = bangDacTinh.find(item => item.truc === 'II');
    if (!trucII) throw new Error("Cannot find data for Shaft II from kinematic table!");
    const n_truc3 = trucII.soVongQuay;

    const Fr_E = 5892.56; const Fa_E = 0; 
    const Fr_F = 3718.09; const Fa_F = 0;    

    const heSo_kd = 1; 
    const oLanModel = new OLan();

    // Lưu ý: Dùng hàm tính Ổ BI ĐỠ (không phải ổ đũa côn)
    const ketQuaViTriE = oLanModel.tinhToanThietKeOBiDoMotDay({ duong_kinh_ngong_truc: d_E, Fr: Fr_E, Fa: Fa_E, so_vong_quay: n_truc3, thoi_gian_phuc_vu_Lh: Lh, he_so_tai_trong_dong_kd: heSo_kd });
    const ketQuaViTriF = oLanModel.tinhToanThietKeOBiDoMotDay({ duong_kinh_ngong_truc: d_F, Fr: Fr_F, Fa: Fa_F, so_vong_quay: n_truc3, thoi_gian_phuc_vu_Lh: Lh, he_so_tai_trong_dong_kd: heSo_kd });

    return { truc: "III", thong_so_chung: { so_vong_quay_n: n_truc3, thoi_gian_phuc_vu_Lh: Lh }, vi_tri_E: ketQuaViTriE, vi_tri_F: ketQuaViTriF };
};