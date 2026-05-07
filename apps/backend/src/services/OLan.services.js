import { OLan } from "../models/OLan.js";
import { tinhBangDacTinhKyThuat } from "./HeThongTruyenDong.services.js";
import { tinh_he_Truc_I, tinh_he_Truc_II, tinh_he_Truc_III } from "./Truc.services.js";

// ==========================================
// TRỤC I
// ==========================================
export const tinhToanOLanTrucI = async (duLieuDauVao) => {
    try {
        const Lh = duLieuDauVao?.thungTron?.thoiGianPhucVu || 0;
        const d_A = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucI?.A || 0;
        const d_B = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucI?.B || 0;
        
        const bangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao) || [];
        const n_truc1 = bangDacTinh.find(t => t.truc === "I")?.soVongQuay || 1;

        const phanLuc = tinh_he_Truc_I(duLieuDauVao) || {};

        // Tính hợp lực hướng tâm và dọc trục tại Service với giá trị mặc định
        const FrA = Math.sqrt(Math.pow(phanLuc.Ax || 0, 2) + Math.pow(phanLuc.Ay || 0, 2));
        const FrB = Math.sqrt(Math.pow(phanLuc.Bx || 0, 2) + Math.pow(phanLuc.By || 0, 2));
        const FaA = Math.abs(phanLuc.Az || 0);
        const FaB = Math.abs(phanLuc.Bz || 0);

        const oLanModel = new OLan();

        return {
            truc: "I",
            vi_tri_A: oLanModel.tinhToanThietKeOLan({ 
                duong_kinh_ngong_truc: d_A, Fr: FrA, Fa: FaA, 
                so_vong_quay: n_truc1, thoi_gian_phuc_vu_Lh: Lh 
            }),
            vi_tri_B: oLanModel.tinhToanThietKeOLan({ 
                duong_kinh_ngong_truc: d_B, Fr: FrB, Fa: FaB, 
                so_vong_quay: n_truc1, thoi_gian_phuc_vu_Lh: Lh 
            })
        };
    } catch (error) {
        console.error("Error in tinhToanOLanTrucI:", error);
        throw error;
    }
};

export const tinhToanOLanTrucII = async (duLieuDauVao) => {
    try {
        const Lh = duLieuDauVao?.thungTron?.thoiGianPhucVu || 0;
        const d_C = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucII?.C || 0;
        const d_D = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucII?.D || 0;
        
        const bangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao) || [];
        const n_truc2 = bangDacTinh.find(t => t.truc === "II")?.soVongQuay || 1;

        const phanLuc = tinh_he_Truc_II(duLieuDauVao) || {};

        const FrC = Math.sqrt(Math.pow(phanLuc.Cx || 0, 2) + Math.pow(phanLuc.Cy || 0, 2));
        const FrD = Math.sqrt(Math.pow(phanLuc.Dx || 0, 2) + Math.pow(phanLuc.Dy || 0, 2));
        const FaC = Math.abs(phanLuc.Cz || 0);
        const FaD = Math.abs(phanLuc.Dz || 0);

        const oLanModel = new OLan();

        return {
            truc: "II",
            vi_tri_C: oLanModel.tinhToanThietKeOLan({ 
                duong_kinh_ngong_truc: d_C, Fr: FrC, Fa: FaC, 
                so_vong_quay: n_truc2, thoi_gian_phuc_vu_Lh: Lh 
            }),
            vi_tri_D: oLanModel.tinhToanThietKeOLan({ 
                duong_kinh_ngong_truc: d_D, Fr: FrD, Fa: FaD, 
                so_vong_quay: n_truc2, thoi_gian_phuc_vu_Lh: Lh 
            })
        };
    } catch (error) {
        console.error("Error in tinhToanOLanTrucII:", error);
        throw error;
    }
};

export const tinhToanOLanTrucIII = async (duLieuDauVao) => {
    try {
        const Lh = duLieuDauVao?.thungTron?.thoiGianPhucVu || 0;
        const d_E = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucIII?.E || 0;
        const d_F = duLieuDauVao?.heThongTruyenDong?.truc?.Thongtintruc?.trucIII?.F || 0;
        
        const bangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao) || [];
        const n_truc3 = bangDacTinh.find(t => t.truc === "III")?.soVongQuay || 1;

        const phanLuc = tinh_he_Truc_III(duLieuDauVao) || {};

        const FrE = Math.sqrt(Math.pow(phanLuc.Ex || 0, 2) + Math.pow(phanLuc.Ey || 0, 2));
        const FrF = Math.sqrt(Math.pow(phanLuc.Fx || 0, 2) + Math.pow(phanLuc.Fy || 0, 2));
        const FaE = Math.abs(phanLuc.Ez || 0);
        const FaF = Math.abs(phanLuc.Fz || 0);

        const oLanModel = new OLan();

        return {
            truc: "III",
            vi_tri_E: oLanModel.tinhToanThietKeOBiDoMotDay({ 
                duong_kinh_ngong_truc: d_E, Fr: FrE, Fa: FaE, 
                so_vong_quay: n_truc3, thoi_gian_phuc_vu_Lh: Lh 
            }),
            vi_tri_F: oLanModel.tinhToanThietKeOBiDoMotDay({ 
                duong_kinh_ngong_truc: d_F, Fr: FrF, Fa: FaF, 
                so_vong_quay: n_truc3, thoi_gian_phuc_vu_Lh: Lh 
            })
        };
    } catch (error) {
        console.error("Error in tinhToanOLanTrucIII:", error);
        throw error;
    }
};