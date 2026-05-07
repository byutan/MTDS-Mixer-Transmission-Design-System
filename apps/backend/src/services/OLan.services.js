import { OLan } from "../models/OLan.js";
import { tinhBangDacTinhKyThuat } from "./HeThongTruyenDong.services.js";
import { tinh_he_Truc_I, tinh_he_Truc_II, tinh_he_Truc_III } from "./Truc.services.js";

// ==========================================
// TRỤC I
// ==========================================
export const tinhToanOLanTrucI = async (duLieuDauVao) => {
    const Lh = duLieuDauVao?.thungTron?.thoiGianPhucVu;
    const d_A = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucI?.A;
    const d_B = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucI?.B;
    
    const bangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao);
    const n_truc1 = bangDacTinh.find(t => t.truc === "I")?.soVongQuay;

    const phanLuc = tinh_he_Truc_I(duLieuDauVao);

    // Tính hợp lực hướng tâm và dọc trục tại Service
    const FrA = Math.sqrt(Math.pow(phanLuc.Ax, 2) + Math.pow(phanLuc.Ay, 2));
    const FrB = Math.sqrt(Math.pow(phanLuc.Bx, 2) + Math.pow(phanLuc.By, 2));
    const FaA = Math.abs(phanLuc.Az);
    const FaB = Math.abs(phanLuc.Bz || 0);

    const oLanModel = new OLan();

    return {
        truc: "I",
        // phan_luc: phanLuc,
        vi_tri_A: oLanModel.tinhToanThietKeOLan({ 
            duong_kinh_ngong_truc: d_A, Fr: FrA, Fa: FaA, 
            so_vong_quay: n_truc1, thoi_gian_phuc_vu_Lh: Lh 
        }),
        vi_tri_B: oLanModel.tinhToanThietKeOLan({ 
            duong_kinh_ngong_truc: d_B, Fr: FrB, Fa: FaB, 
            so_vong_quay: n_truc1, thoi_gian_phuc_vu_Lh: Lh 
        })
    };
};

// ==========================================
// TRỤC II
// ==========================================
export const tinhToanOLanTrucII = async (duLieuDauVao) => {
    const Lh = duLieuDauVao?.thungTron?.thoiGianPhucVu;
    const d_C = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucII?.C;
    const d_D = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucII?.D;
    
    const bangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao);
    const n_truc2 = bangDacTinh.find(t => t.truc === "I")?.soVongQuay;

    const phanLuc = tinh_he_Truc_II(duLieuDauVao);

    const FrC = Math.sqrt(Math.pow(phanLuc.Cx, 2) + Math.pow(phanLuc.Cy, 2));
    const FrD = Math.sqrt(Math.pow(phanLuc.Dx, 2) + Math.pow(phanLuc.Dy, 2));
    const FaC = Math.abs(phanLuc.Cz );
    const FaD = Math.abs(phanLuc.Dz );

    const oLanModel = new OLan();

    return {
        truc: "II",
        // phan_luc: phanLuc,
        vi_tri_C: oLanModel.tinhToanThietKeOLan({ 
            duong_kinh_ngong_truc: d_C, Fr: FrC, Fa: FaC, 
            so_vong_quay: n_truc2, thoi_gian_phuc_vu_Lh: Lh 
        }),
        vi_tri_D: oLanModel.tinhToanThietKeOLan({ 
            duong_kinh_ngong_truc: d_D, Fr: FrD, Fa: FaD, 
            so_vong_quay: n_truc2, thoi_gian_phuc_vu_Lh: Lh 
        })
    };
};

// ==========================================
// TRỤC III
// ==========================================
export const tinhToanOLanTrucIII = async (duLieuDauVao) => {
    const Lh = duLieuDauVao?.thungTron?.thoiGianPhucVu;
    const d_E = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucIII?.E;
    const d_F = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucIII?.F;
    
    const bangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao);
    const n_truc3 = bangDacTinh.find(t => t.truc === "III")?.soVongQuay;

    const phanLuc = tinh_he_Truc_III(duLieuDauVao);

    const FrE = Math.sqrt(Math.pow(phanLuc.Ex, 2) + Math.pow(phanLuc.Ey, 2));
    const FrF = Math.sqrt(Math.pow(phanLuc.Fx, 2) + Math.pow(phanLuc.Fy, 2));
    const FaE = Math.abs(phanLuc.Ez || 0);
    const FaF = Math.abs(phanLuc.Fz || 0);

    const oLanModel = new OLan();

    return {
        truc: "III",
        // phan_luc: phanLuc,
        vi_tri_E: oLanModel.tinhToanThietKeOBiDoMotDay({ 
            duong_kinh_ngong_truc: d_E, Fr: FrE, Fa: FaE, 
            so_vong_quay: n_truc3, thoi_gian_phuc_vu_Lh: Lh 
        }),
        vi_tri_F: oLanModel.tinhToanThietKeOBiDoMotDay({ 
            duong_kinh_ngong_truc: d_F, Fr: FrF, Fa: FaF, 
            so_vong_quay: n_truc3, thoi_gian_phuc_vu_Lh: Lh 
        })
    };
};