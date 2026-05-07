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
            35: { ky_hieu: '7507', d: 35, D: 72, D1: 58, d1: 52.5, B: 23, C1: 20, T: 24.25, r1: 2.0, r: 0.8, alpha_deg: 13, C_kN: 50.2, C0_kN: 40.3 },
            40: { ky_hieu: '7508', d: 40, D: 80, D1: 64, d1: 58.5, B: 23, C1: 19, T: 24.75, r1: 2.0, r: 0.8, alpha_deg: 14.25, C_kN: 53.9, C0_kN: 44.8 }
        };

        if (!bangTra[d]) {
            throw new Error(`Không tìm thấy thông số ổ đũa côn cho d = ${d}mm.`);
        }
        return bangTra[d];
    }

    static xacDinhHeSoXY(Fa, Fr, alpha_deg, V = 1) {
        if (Fr === 0) return { e: 0, X: 1, Y: 0, ratio: 0 };

        const alpha_rad = alpha_deg * (Math.PI / 180);
        const e = 1.5 * Math.tan(alpha_rad);
        
        let X, Y;
        const ratio = Fa / (V * Fr);
        
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
            // chi_tiet_tinh_toan: {
            //     Fr_N: Number(Fr.toFixed(3)),
            //     Fa_N: Number(Fa.toFixed(3)),
            //     ti_so_Fa_VFr: he_so.ratio,
            //     he_so_e: he_so.e,
            //     he_so_X: he_so.X,
            //     he_so_Y: he_so.Y,
            //     tai_trong_dong_quy_uoc_Q_N: Q_N,
            //     tuoi_tho_trieu_vong_quay_L: parseFloat(L.toFixed(3)),
            //     kha_nang_tai_dong_tinh_toan_Cd_kN: parseFloat(Cd_kN.toFixed(3))
            // },
            ket_qua_kiem_nghiem: { 
                Cd_kN: parseFloat(Cd_kN.toFixed(3)), 
                C_bang_tra_kN: thong_so_o.C_kN, 
                ket_luan: Cd_kN <= thong_so_o.C_kN ? "Passed" : "Failed" 
            }
        };
    }

    // ==========================================
    // 2. Ổ BI ĐỠ MỘT DÃY (DÙNG CHO TRỤC III)
    // ==========================================
    static traBangThongSoOBiDoMotDay(d) {
        const bangTra = {
            65: { ky_hieu: '313', d: 65, D: 140, B: 33, r: 3.5, d_bi: 23.81, C_kN: 72.4, C0_kN: 56.7 }
        };

        if (!bangTra[d]) {
            throw new Error(`Không tìm thấy thông số ổ bi cho d = ${d}mm.`);
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
            // chi_tiet_tinh_toan: {
            //     Fr_N: Number(Fr.toFixed(3)),
            //     Fa_N: Number(Fa.toFixed(3)),
            //     ti_so_Fa_VFr: Fr > 0 ? parseFloat((Fa / Fr).toFixed(3)) : 0,
            //     he_so_e: 0,
            //     he_so_X: X, 
            //     he_so_Y: Y,
            //     tai_trong_dong_quy_uoc_Q_N: Q_N,
            //     tuoi_tho_trieu_vong_quay_L: parseFloat(L.toFixed(3)),
            //     kha_nang_tai_dong_tinh_toan_Cd_kN: parseFloat(Cd_kN.toFixed(3))
            // },
            ket_qua_kiem_nghiem: { 
                Cd_kN: parseFloat(Cd_kN.toFixed(3)), 
                C_bang_tra_kN: thong_so_o.C_kN, 
                ket_luan: Cd_kN <= thong_so_o.C_kN ? "Passed" : "Failed" 
            }
        };
    }
}