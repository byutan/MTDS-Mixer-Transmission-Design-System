import { BoTruyen } from "../builders.interface/BoTruyen.interface.js"

export class OLan extends BoTruyen {
    static HIEU_SUAT_MIN = 0.99
    static HIEU_SUAT_MAX = 0.995
    static HIEU_SUAT_DEFAULT = 0.995
    #hieuSuat

    constructor({ hieuSuat = OLan.HIEU_SUAT_DEFAULT } = {}) {
        super();
        if (!OLan.kiemTraHieuSuat(hieuSuat)) {
            throw new Error(`${hieuSuat} is out of [${OLan.HIEU_SUAT_MIN}, ${OLan.HIEU_SUAT_MAX}] range.`);
        }
        this.#hieuSuat = hieuSuat;
    }

    // Hàm kiểm tra hiệu suất (Đã khôi phục)
    static kiemTraHieuSuat(hieuSuat) {
        return (hieuSuat >= OLan.HIEU_SUAT_MIN && hieuSuat <= OLan.HIEU_SUAT_MAX);
    }

    getHieuSuat() {
        return this.#hieuSuat;
    }

    tinhTaiTrongDongQuyUoc({ Fr, Fa, X, Y, V = 1, kt = 1, kd = 1 }) {
        const Q = (X * V * Fr + Y * Fa) * kt * kd;
        return parseFloat(Q.toFixed(3));
    }

    // ==========================================
    // 1. Ổ ĐŨA CÔN (DÙNG CHO TRỤC I & II)
    // ==========================================
    static traBangThongSoODuaCon(d) {
        const bangTra = {
            15: { ky_hieu: '7202', d: 15, D: 35, B: 11, C_kN: 8.5, C0_kN: 5.5, alpha_deg: 12 },
            17: { ky_hieu: '7203', d: 17, D: 40, B: 12, C_kN: 10.2, C0_kN: 7.2, alpha_deg: 12 },
            20: { ky_hieu: '7204', d: 20, D: 47, B: 14, C_kN: 14.3, C0_kN: 10.2, alpha_deg: 13 },
            25: { ky_hieu: '7205', d: 25, D: 52, B: 15, C_kN: 16.5, C0_kN: 12.5, alpha_deg: 13 },
            30: { ky_hieu: '7206', d: 30, D: 62, d1: 45.5, B: 16, C1: 14, T: 17.25, alpha_deg: 13, C_kN: 26.5, C0_kN: 23.5 },
            35: { ky_hieu: '7507', d: 35, D: 72, D1: 58, d1: 52.5, B: 23, C1: 20, T: 24.25, r1: 2.0, r: 0.8, alpha_deg: 13, C_kN: 50.2, C0_kN: 40.3 },
            40: { ky_hieu: '7508', d: 40, D: 80, D1: 64, d1: 58.5, B: 23, C1: 19, T: 24.75, r1: 2.0, r: 0.8, alpha_deg: 14.25, C_kN: 53.9, C0_kN: 44.8 },
            45: { ky_hieu: '7209', d: 45, D: 85, d1: 64.5, B: 19, C1: 16, T: 20.75, alpha_deg: 14, C_kN: 44.5, C0_kN: 41.5 },
            50: { ky_hieu: '7210', d: 50, D: 90, d1: 69.5, B: 20, C1: 17, T: 21.75, alpha_deg: 15, C_kN: 51.5, C0_kN: 49.5 },
            55: { ky_hieu: '7211', d: 55, D: 100, d1: 77.5, B: 21, C1: 18, T: 22.75, alpha_deg: 15, C_kN: 62.5, C0_kN: 60.5 },
            60: { ky_hieu: '7212', d: 60, D: 110, B: 22, C_kN: 75.0, C0_kN: 72.0, alpha_deg: 15 },
            65: { ky_hieu: '7213', d: 65, D: 120, B: 23, C_kN: 85.0, C0_kN: 82.0, alpha_deg: 16 }
        };

        if (!bangTra[d]) {
            // Return a safe placeholder instead of throwing
            return { ky_hieu: 'N/A', d: d, D: 0, B: 0, r: 0, d_bi: 0, C_kN: 0, C0_kN: 0, alpha: 0, e: 0, Y: 0 };
        }
        return bangTra[d];
    }

    static xacDinhHeSoXY(Fa, Fr, alpha_deg = 0, V = 1) {
        if (!Fr || Fr === 0) return { e: 0, X: 1, Y: 0, ratio: 0 };
        
        const alpha_rad = (alpha_deg || 0) * (Math.PI / 180);
        const e = 1.5 * Math.tan(alpha_rad);
        
        let X, Y;
        const ratio = (Fa || 0) / (V * Fr);
        
        if (ratio <= e) {
            X = 1; Y = 0;
        } else {
            X = 0.4; Y = 0.4 * (1 / Math.tan(alpha_rad));
        }
        
        return { e: parseFloat(e.toFixed(3)), X: X, Y: parseFloat(Y.toFixed(3)), ratio: parseFloat(ratio.toFixed(3)) };
    }

    tinhToanThietKeOLan({ duong_kinh_ngong_truc, Fr, Fa, so_vong_quay, thoi_gian_phuc_vu_Lh, he_so_tai_trong_dong_kd = 1 }) {
        const thong_so_o = OLan.traBangThongSoODuaCon(duong_kinh_ngong_truc);
        
        // Tính toán với đơn vị Newton (N) để khớp đồ án
        const he_so = OLan.xacDinhHeSoXY(Fa, Fr, thong_so_o.alpha_deg, 1);
        const Q_N = this.tinhTaiTrongDongQuyUoc({ Fr: Fr, Fa: Fa, X: he_so.X, Y: he_so.Y, V: 1, kt: 1, kd: he_so_tai_trong_dong_kd });

        const L = (thoi_gian_phuc_vu_Lh * 60 * so_vong_quay) / 1000000;
        const m = 10 / 3; 
        const Cd_N = Q_N * Math.pow(L, 1/m);
        const Cd_kN = Cd_N / 1000;

        return {
            bang_chon_o: {
                loai_o: "Ổ đũa côn",
                ky_hieu: thong_so_o.ky_hieu,
                d: thong_so_o.d,
                D: thong_so_o.D,
                D1: thong_so_o.D1,
                d1: thong_so_o.d1,
                B: thong_so_o.B,
                C1: thong_so_o.C1,
                T: thong_so_o.T,
                r1: thong_so_o.r1,
                r: thong_so_o.r,
                alpha_deg: thong_so_o.alpha_deg,
                C_kN: thong_so_o.C_kN,
                C0_kN: thong_so_o.C0_kN
            },
            chi_tiet_tinh_toan: {
                Fr_N: Number((Fr || 0).toFixed(3)),
                Fa_N: Number((Fa || 0).toFixed(3)),
                ti_so_Fa_VFr: Number((he_so.ratio || 0).toFixed(3)),
                he_so_e: Number((he_so.e || 0).toFixed(3)),
                he_so_X: he_so.X,
                he_so_Y: Number((he_so.Y || 0).toFixed(3)),
                tai_trong_dong_quy_uoc_Q_N: Number((Q_N || 0).toFixed(3)),
                tuoi_tho_trieu_vong_quay_L: Number((L || 0).toFixed(3)),
                kha_nang_tai_dong_tinh_toan_Cd_kN: Number((Cd_kN || 0).toFixed(3))
            },
            ket_qua_kiem_nghiem: { 
                Cd_kN: parseFloat((Cd_kN || 0).toFixed(3)), 
                C_bang_tra_kN: thong_so_o.C_kN, 
                ket_luan: (Cd_kN || 0) <= (thong_so_o.C_kN || 0) ? "Passed" : "Failed" 
            }
        };
    }

    // ==========================================
    // 2. Ổ BI ĐỠ MỘT DÃY (DÙNG CHO TRỤC III)
    // ==========================================
    static traBangThongSoOBiDoMotDay(d) {
        const bangTra = {
            20: { ky_hieu: '204', d: 20, D: 47, B: 14, r: 1.5, d_bi: 7.94, C_kN: 12.7, C0_kN: 6.7 },
            25: { ky_hieu: '205', d: 25, D: 52, B: 15, r: 1.5, d_bi: 7.94, C_kN: 14.0, C0_kN: 7.8 },
            30: { ky_hieu: '206', d: 30, D: 62, B: 16, r: 1.5, d_bi: 9.52, C_kN: 19.5, C0_kN: 11.3 },
            35: { ky_hieu: '207', d: 35, D: 72, B: 17, r: 2.0, d_bi: 11.11, C_kN: 25.5, C0_kN: 15.3 },
            40: { ky_hieu: '208', d: 40, D: 80, B: 18, r: 2.0, d_bi: 12.70, C_kN: 32.0, C0_kN: 19.0 },
            45: { ky_hieu: '209', d: 45, D: 85, B: 19, r: 2.0, d_bi: 12.70, C_kN: 33.2, C0_kN: 21.6 },
            50: { ky_hieu: '310', d: 50, D: 110, B: 27, r: 3.0, d_bi: 19.05, C_kN: 47.5, C0_kN: 38.0 },
            55: { ky_hieu: '311', d: 55, D: 120, B: 29, r: 3.0, d_bi: 20.64, C_kN: 55.5, C0_kN: 44.5 },
            60: { ky_hieu: '312', d: 60, D: 130, B: 31, r: 3.5, d_bi: 22.22, C_kN: 64.0, C0_kN: 51.0 },
            65: { ky_hieu: '313', d: 65, D: 140, B: 33, r: 3.5, d_bi: 23.81, C_kN: 72.4, C0_kN: 56.7 },
            70: { ky_hieu: '314', d: 70, D: 150, B: 35, r: 3.5, d_bi: 25.40, C_kN: 81.5, C0_kN: 64.0 },
            75: { ky_hieu: '315', d: 75, D: 160, B: 37, r: 3.5, d_bi: 26.99, C_kN: 91.5, C0_kN: 72.5 },
            80: { ky_hieu: '316', d: 80, D: 170, B: 39, r: 3.5, d_bi: 28.58, C_kN: 102.0, C0_kN: 81.5 },
            85: { ky_hieu: '317', d: 85, D: 180, B: 41, r: 4.0, d_bi: 30.16, C_kN: 110.0, C0_kN: 90.0 },
            90: { ky_hieu: '318', d: 90, D: 190, B: 43, r: 4.0, d_bi: 31.75, C_kN: 120.0, C0_kN: 100.0 }
        };

        if (!bangTra[d]) {
            // Return a safe placeholder instead of throwing
            return { ky_hieu: 'N/A', d: d, D: 0, B: 0, r: 0, d_bi: 0, C_kN: 0, C0_kN: 0 };
        }
        return bangTra[d];
    }

    tinhToanThietKeOBiDoMotDay({ duong_kinh_ngong_truc, Fr, Fa, so_vong_quay, thoi_gian_phuc_vu_Lh, he_so_tai_trong_dong_kd = 1 }) {
        const thong_so_o = OLan.traBangThongSoOBiDoMotDay(duong_kinh_ngong_truc);
        
        const X = 1;
        const Y = 0;
        const Q_N = this.tinhTaiTrongDongQuyUoc({ Fr: Fr, Fa: Fa, X: X, Y: Y, V: 1, kt: 1, kd: he_so_tai_trong_dong_kd });

        const L = (thoi_gian_phuc_vu_Lh * 60 * so_vong_quay) / 1000000;
        const m = 3; 
        const Cd_N = Q_N * Math.pow(L, 1/m);
        const Cd_kN = Cd_N / 1000;

        return {
            bang_chon_o: {
                loai_o: "Ổ bi đỡ một dãy",
                ky_hieu: thong_so_o.ky_hieu,
                d: thong_so_o.d,
                D: thong_so_o.D,
                B: thong_so_o.B,
                r: thong_so_o.r,
                duong_kinh_bi: thong_so_o.d_bi,
                C_kN: thong_so_o.C_kN,
                C0_kN: thong_so_o.C0_kN
            },
            chi_tiet_tinh_toan: {
                Fr_N: Number((Fr || 0).toFixed(3)),
                Fa_N: Number((Fa || 0).toFixed(3)),
                ti_so_Fa_VFr: Fr > 0 ? Number((Fa / Fr).toFixed(3)) : 0,
                he_so_e: 0,
                he_so_X: X, 
                he_so_Y: Y,
                tai_trong_dong_quy_uoc_Q_N: Number((Q_N || 0).toFixed(3)),
                tuoi_tho_trieu_vong_quay_L: Number((L || 0).toFixed(3)),
                kha_nang_tai_dong_tinh_toan_Cd_kN: Number((Cd_kN || 0).toFixed(3))
            },
            ket_qua_kiem_nghiem: { 
                Cd_kN: parseFloat((Cd_kN || 0).toFixed(3)), 
                C_bang_tra_kN: thong_so_o.C_kN, 
                ket_luan: (Cd_kN || 0) <= (thong_so_o.C_kN || 0) ? "Passed" : "Failed" 
            }
        };
    }
}