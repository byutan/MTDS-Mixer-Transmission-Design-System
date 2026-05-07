import { BoTruyenBanhRang } from "../builders.interface/BoTruyenBanhRang.js"

export class BanhRangCon extends BoTruyenBanhRang {
    static HIEU_SUAT_DEFAULT = 0.96
    static CAP_CHINH_XAC_MIN = 6
    static CAP_CHINH_XAC_MAX = 9
    static CAP_CHINH_XAC_DEFAULT = 8
    static CHE_KIN_DEFAULT = true

    constructor({ hieuSuat = BanhRangCon.HIEU_SUAT_DEFAULT, capChinhXac = BanhRangCon.CAP_CHINH_XAC_DEFAULT, cheKin = BanhRangCon.CHE_KIN_DEFAULT } = {}) {
        const range = BanhRangCon.layKhoangHieuSuat(capChinhXac, cheKin)
        if (range) {
            const { min, max } = range
            if (hieuSuat < min || hieuSuat > max) {
                throw new Error(`${hieuSuat} is out of [${min}, ${max}] range.`)
            }
        }
        super({hieuSuat, capChinhXac, cheKin})
    }

    static layKhoangHieuSuat(capChinhXac, cheKin) {
        if (cheKin) {
            if (capChinhXac >= 8 && capChinhXac <= 9) return { min: 0.95, max: 0.97 }
            else if (capChinhXac >= 6 && capChinhXac <= 7) return { min: 0.96, max: 0.98 }
            else throw new Error(`${capChinhXac} is out of [${BanhRangCon.CAP_CHINH_XAC_MIN}, ${BanhRangCon.CAP_CHINH_XAC_MAX}] range.`)
        } else {
            if (capChinhXac >= 8 && capChinhXac <= 9) return { min: 0.92, max: 0.94 }
            else if (capChinhXac >= 6 && capChinhXac <= 7) return { min: 0.93, max: 0.95 }
            else throw new Error(`${capChinhXac} is out of [${BanhRangCon.CAP_CHINH_XAC_MIN}, ${BanhRangCon.CAP_CHINH_XAC_MAX}] range.`)
        }
    } 

    // --- CÁC HÀM BẮT BUỘC KẾ THỪA TỪ HỆ THỐNG OOP ---

    #giaiPhuongTrinhTimU2(lambda_K, c_K, u_h) {
        const A = lambda_K * Math.pow(c_K, 3);
        const uh2 = Math.pow(u_h, 2);
        const uh3 = Math.pow(u_h, 3);
        const f = (x) => A * Math.pow(x, 4) - uh2 * x - uh3;
        const df = (x) => 4 * A * Math.pow(x, 3) - uh2;
        let x0 = 3.0;
        const saiSo = 1e-5;
        for (let i = 0; i < 100; i++) {
            let x1 = x0 - f(x0) / df(x0);
            if (Math.abs(x1 - x0) < saiSo) return Number(x1.toFixed(2)); 
            x0 = x1;
        }
        throw new Error("Unable to find appropriate value.");
    }

    tinhTySoTruyen({ u_h, lambda_k, c_k }) {
        if (!u_h || !lambda_k || !c_k) throw new Error("Missing value.");
        return this.#giaiPhuongTrinhTimU2(lambda_k, c_k, u_h);
    }

    // --- CÁC HÀM TÍNH TOÁN HÌNH HỌC BÁNH RĂNG CÔN CỦA RIÊNG BẠN ---
    static traBangZ1p(de1, u) {
        const de1_levels = [40, 60, 80, 100, 125, 160, 200];
        const u_levels = [1, 2, 3.15, 4, 6];
        const table = [
          [24, 20, 18, 16, 15], [24, 20, 18, 16, 15], [25, 21, 19, 17, 16],
          [25, 21, 19, 17, 16], [26, 22, 20, 18, 17], [27, 24, 22, 21, 18],
          [30, 28, 27, 24, 22] 
        ];
        let r = de1_levels.findIndex(val => de1 <= val);
        if (r === -1) r = de1_levels.length - 1;
        let c = 0, minDiff = Infinity;
        for (let i = 0; i < u_levels.length; i++) {
            if (Math.abs(u - u_levels[i]) < minDiff) { minDiff = Math.abs(u - u_levels[i]); c = i; }
        }
        return table[r][c];
    }

    tinhToanThongSoHinhHoc({ T1, n1, u, Kbe, custom_z1, custom_z2 }) {
        if (!T1 || !n1 || !u) throw new Error("Missing geometric calculation values (T1, n1, u).");

        const STANDARD_MODULES_DAY_1 = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12];
        const kd = 100, kh_beta = 1.11, hb1 = 310, hb2 = 300, sH = 1.1, KHL = 1;

        const allowable_sigma_H = Math.min(((2 * hb1 + 70) * 0.9 * KHL) / sH, ((2 * hb2 + 70) * 0.9 * KHL) / sH);
        const Kr = 0.5 * kd; 
        
        const phan_ngoai_can = Kr * Math.sqrt(Math.pow(u, 2) + 1);
        const phan_trong_can = (T1 * kh_beta) / ((1 - Kbe) * Kbe * u * Math.pow(allowable_sigma_H, 2));
        const Re_sb = phan_ngoai_can * Math.pow(phan_trong_can, 1/3);
        const de1_sb = (2 * Re_sb) / Math.sqrt(Math.pow(u, 2) + 1);
        
        const z1p = BanhRangCon.traBangZ1p(de1_sb, u);
        const he_so_z1 = (hb1 > 350 && hb2 <= 350) ? 1.3 : (hb1 > 350 && hb2 > 350) ? 1.0 : 1.6;
        const z1_so_bo_chon = Math.round(he_so_z1 * z1p); 

        const dm1_sb = (1 - 0.5 * Kbe) * de1_sb;
        const mte_sb = (dm1_sb / z1_so_bo_chon) / (1 - 0.5 * Kbe);
        const mte = STANDARD_MODULES_DAY_1.find(m => m >= mte_sb) || mte_sb;

        const mtm_thuc_te = mte * (1 - 0.5 * Kbe);
        const z1 = custom_z1 || Math.ceil(dm1_sb / mtm_thuc_te); 
        const z2 = custom_z2 || Math.round(u * z1);

        const Re = 0.5 * mte * Math.sqrt(Math.pow(z1, 2) + Math.pow(z2, 2));
        const b_exact = Kbe * Re;
        const b_chon = Math.round(b_exact); 
        const Rm = Re - 0.5 * b_exact; 

        const de1 = mte * z1, de2 = mte * z2;
        const delta1_rad = Math.atan(z1 / z2);
        const delta2_rad = (Math.PI / 2) - delta1_rad;
        const delta1_deg = delta1_rad * (180 / Math.PI);
        const delta2_deg = 90 - delta1_deg;

        const he = 2.2 * mte, hae1 = mte, hae2 = mte, hfe1 = he - hae1, hfe2 = he - hae2;
        const dm1 = (1 - 0.5 * Kbe) * de1, dm2 = (1 - 0.5 * Kbe) * de2;
        
        const B1 = Re * Math.cos(delta1_rad) - hae1 * Math.sin(delta1_rad);
        const B2 = Re * Math.cos(delta2_rad) - hae2 * Math.sin(delta2_rad);
        const dae1 = de1 + 2 * hae1 * Math.cos(delta1_rad);
        const dae2 = de2 + 2 * hae2 * Math.cos(delta2_rad);
        const theta_f_deg = Math.atan(hfe1 / Re) * (180 / Math.PI); 

        // ==========================================
        // PHẦN THÊM MỚI: TÍNH LỰC TÁC DỤNG LÊN BÁNH RĂNG
        // ==========================================
        const alpha_rad = 20 * (Math.PI / 180); // Góc ăn khớp tiêu chuẩn 20 độ

        // Lực vòng
        const Ft1 = (2 * T1 ) / dm1;
        const Ft2 = Ft1;

        // Lực hướng tâm và lực dọc trục bánh dẫn
        const Fr1 = Ft1 * Math.tan(alpha_rad) * Math.cos(delta1_rad);
        const Fa1 = Ft1 * Math.tan(alpha_rad) * Math.sin(delta1_rad);

        // Lực tác dụng lên bánh bị dẫn
        const Fa2 = Fr1;
        const Fr2 = Fa1;
        // ==========================================

        return {
            bang_thong_so_hinh_hoc: {
                chieu_rong_con_ngoai: parseFloat((Re || 0).toFixed(3)),
                chieu_rong_vanh_rang: b_chon,
                chieu_dai_con_trung_binh: parseFloat((Rm || 0).toFixed(3)),
                duong_kinh_vong_chia_ngoai: `de1 = ${parseFloat((de1 || 0).toFixed(3))}, de2 = ${parseFloat((de2 || 0).toFixed(3))}`,
                goc_chia_mat_con: `delta1 = ${parseFloat((delta1_deg || 0).toFixed(2))}, delta2 = ${parseFloat((delta2_deg || 0).toFixed(2))}`,
                chieu_cao_rang_ngoai: parseFloat((he || 0).toFixed(3)),
                chieu_cao_dau_rang_ngoai: `hae1 = ${parseFloat((hae1 || 0).toFixed(3))}, hae2 = ${parseFloat((hae2 || 0).toFixed(3))}`,
                chieu_cao_chan_rang_ngoai: `hfe1 = ${parseFloat((hfe1 || 0).toFixed(3))}, hfe2 = ${parseFloat((hfe2 || 0).toFixed(3))}`,
                duong_kinh_trung_binh: `dm1 = ${parseFloat((dm1 || 0).toFixed(3))}, dm2 = ${parseFloat((dm2 || 0).toFixed(3))}`,
                kc_tu_dinh_den_mat_phang_vong_ngoai_dinh_rang: `B1 = ${parseFloat((B1 || 0).toFixed(3))}, B2 = ${parseFloat((B2 || 0).toFixed(3))}`,
                duong_kinh_dinh_rang_ngoai: `dae1 = ${parseFloat((dae1 || 0).toFixed(3))}, dae2 = ${parseFloat((dae2 || 0).toFixed(3))}`,
                goc_con_dinh: `delta_a1 = ${parseFloat(((delta1_deg || 0) + (theta_f_deg || 0)).toFixed(2))}, delta_a2 = ${parseFloat(((delta2_deg || 0) + (theta_f_deg || 0)).toFixed(2))}`,
                goc_con_day: `delta_f1 = ${parseFloat(((delta1_deg || 0) - (theta_f_deg || 0)).toFixed(2))}, delta_f2 = ${parseFloat(((delta2_deg || 0) - (theta_f_deg || 0)).toFixed(2))}`
            },
            bang_luc_tac_dung: {
                Ft1: parseFloat((Ft1 || 0).toFixed(2)),
                Fr1: parseFloat((Fr1 || 0).toFixed(2)),
                Fa1: parseFloat((Fa1 || 0).toFixed(2)),
                Ft2: parseFloat((Ft2 || 0).toFixed(2)),
                Fr2: parseFloat((Fr2 || 0).toFixed(2)),
                Fa2: parseFloat((Fa2 || 0).toFixed(2)),
                dm1: parseFloat((dm1 || 0).toFixed(2)),
                dm2: parseFloat((dm2 || 0).toFixed(2))
            },
            du_lieu_so: {
                mte: mte,
                z1: z1,
                z2: z2,
                de1: parseFloat((de1 || 0).toFixed(2)),
                de2: parseFloat((de2 || 0).toFixed(2)),
                b: b_chon,
                delta1: parseFloat((delta1_deg || 0).toFixed(2)),
                delta2: parseFloat((delta2_deg || 0).toFixed(2))
            }
        };
    }
}