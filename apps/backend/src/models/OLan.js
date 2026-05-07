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
            throw new Error(`Tapered roller bearing parameters not found for d = ${d}mm.`);
        }
        return bangTra[d];
    }

    static xacDinhHeSoXY(Fa, Fr, alpha_deg, V = 1) {
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
        const Fr_kN = Fr / 1000;
        const Fa_kN = Fa / 1000;

        const he_so = OLan.xacDinhHeSoXY(Fa_kN, Fr_kN, thong_so_o.alpha_deg, 1);
        const Q = this.tinhTaiTrongDongQuyUoc({ Fr: Fr_kN, Fa: Fa_kN, X: he_so.X, Y: he_so.Y, V: 1, kt: 1, kd: he_so_tai_trong_dong_kd });

        const L = (thoi_gian_phuc_vu_Lh * 60 * so_vong_quay) / 1000000;
        const m = 10 / 3; // Bậc đường cong mỏi của ổ đũa
        const Cd = Q * Math.pow(L, 1/m);

        return {
            bang_chon_o: { loai_o: "Ổ đũa côn", ...thong_so_o },
            chi_tiet_tinh_toan: {
                ti_so_Fa_VFr: he_so.ratio, he_so_e: he_so.e, he_so_X: he_so.X, he_so_Y: he_so.Y,
                tuoi_tho_trieu_vong_quay_L: parseFloat(L.toFixed(3)), tai_trong_dong_quy_uoc_Q_kN: Q,
                kha_nang_tai_dong_tinh_toan_Cd_kN: parseFloat(Cd.toFixed(3))
            },
            ket_qua_kiem_nghiem: { Cd_kN: parseFloat(Cd.toFixed(3)), C_bang_tra_kN: thong_so_o.C_kN, ket_luan: Cd <= thong_so_o.C_kN ? "Passed (Cd <= C)" : "Failed (Cd > C)" }
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
            throw new Error(`Ball bearing parameters not found for d = ${d}mm.`);
        }
        return bangTra[d];
    }

    tinhToanThietKeOBiDoMotDay({ duong_kinh_ngong_truc, Fr, Fa, so_vong_quay, thoi_gian_phuc_vu_Lh, he_so_tai_trong_dong_kd = 1 }) {
        const thong_so_o = OLan.traBangThongSoOBiDoMotDay(duong_kinh_ngong_truc);
        const Fr_kN = Fr / 1000;
        const Fa_kN = Fa / 1000;

        // Theo tài liệu: Fa = 0 -> X = 1, Y = 0
        const X = 1;
        const Y = 0;

        const Q = this.tinhTaiTrongDongQuyUoc({ Fr: Fr_kN, Fa: Fa_kN, X: X, Y: Y, V: 1, kt: 1, kd: he_so_tai_trong_dong_kd });

        const L = (thoi_gian_phuc_vu_Lh * 60 * so_vong_quay) / 1000000;
        const m = 3; // Bậc đường cong mỏi của ổ bi là 3
        const Cd = Q * Math.pow(L, 1/m);

        return {
            bang_chon_o: { loai_o: "Ổ bi đỡ một dãy", ...thong_so_o },
            chi_tiet_tinh_toan: {
                he_so_X: X, he_so_Y: Y,
                tuoi_tho_trieu_vong_quay_L: parseFloat(L.toFixed(3)), tai_trong_dong_quy_uoc_Q_kN: Q,
                kha_nang_tai_dong_tinh_toan_Cd_kN: parseFloat(Cd.toFixed(3))
            },
            ket_qua_kiem_nghiem: { Cd_kN: parseFloat(Cd.toFixed(3)), C_bang_tra_kN: thong_so_o.C_kN, ket_luan: Cd <= thong_so_o.C_kN ? "Passed (Cd <= C)" : "Failed (Cd > C)" }
        };
    }
    
}