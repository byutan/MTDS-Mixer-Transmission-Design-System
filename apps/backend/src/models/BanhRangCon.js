import { BoTruyenBanhRang } from "../builders.interface/BoTruyenBanhRang.js"
export class BanhRangCon extends BoTruyenBanhRang {
    // Trị số mặc định
    static HIEU_SUAT_DEFAULT = 0.96
    static CAP_CHINH_XAC_MIN = 6
    static CAP_CHINH_XAC_MAX = 9
    static CAP_CHINH_XAC_DEFAULT = 8
    static CHE_KIN_DEFAULT = true
    /**
     * @param {{ 
     * hieuSuat?: number, 
     * capChinhXac?: number, 
     * cheKin?: boolean 
     * }} params
     */
    constructor({
        hieuSuat = BanhRangCon.HIEU_SUAT_DEFAULT, 
        capChinhXac = BanhRangCon.CAP_CHINH_XAC_DEFAULT, 
        cheKin = BanhRangCon.CHE_KIN_DEFAULT
        } = {}) {
        const range = BanhRangCon.layKhoangHieuSuat(capChinhXac, cheKin)
        if (range) {
            const { min, max } = range
        
            if (hieuSuat < min || hieuSuat > max) {
                throw new Error(`${hieuSuat} is out of [${min}, ${max}] range.`)
            }
        }
        super({hieuSuat, capChinhXac, cheKin})
    }

    // Lấy khoảng giá trị theo trạng thái: Che kín || Để hở
    static layKhoangHieuSuat(capChinhXac, cheKin) {
        if (cheKin) {
            if (capChinhXac >= 8 && capChinhXac <= 9) {
                return { min: 0.95, max: 0.97 }
            }
            else if (capChinhXac >= 6 && capChinhXac <= 7) {
                return { min: 0.96, max: 0.98 }
            }
            else {
                throw new Error(`${capChinhXac} is out of [${BanhRangCon.CAP_CHINH_XAC_MIN}, ${BanhRangCon.CAP_CHINH_XAC_MAX}] range.`)
            }
        } 
        else {
            if (capChinhXac >= 8 && capChinhXac <= 9) {
                return { min: 0.92, max: 0.94 }
            }
            else if (capChinhXac >= 6 && capChinhXac <= 7) {
                return { min: 0.93, max: 0.95 }
            }
            else {
                throw new Error(`${capChinhXac} is out of [${BanhRangCon.CAP_CHINH_XAC_MIN}, ${BanhRangCon.CAP_CHINH_XAC_MAX}] range.`)
            }
        }
    } 
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
            if (Math.abs(x1 - x0) < saiSo) {
                return Number(x1.toFixed(2)); 
            }
            x0 = x1;
        }
        throw new Error("Unable to find appropriate value.");
    }
    /**
     * @param {Object} params 
     */
    tinhTySoTruyen({ u_h, lambda_k, c_k }) {
        if (!u_h || !lambda_k || !c_k) {
            throw new Error("Missing value.");
        }
        const u2 = this.#giaiPhuongTrinhTimU2(lambda_k, c_k, u_h);
        return u2;
    }
}