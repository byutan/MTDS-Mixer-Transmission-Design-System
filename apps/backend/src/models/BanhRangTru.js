import { BoTruyenBanhRang } from "../builders.interface/BoTruyenBanhRang.js"
export class BanhRangTru extends BoTruyenBanhRang {
    // Trị số mặc định
    static HIEU_SUAT_DEFAULT = 0.97
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
        hieuSuat = BanhRangTru.HIEU_SUAT_DEFAULT, 
        capChinhXac = BanhRangTru.CAP_CHINH_XAC_DEFAULT, 
        cheKin = BanhRangTru.CHE_KIN_DEFAULT
        } = {}) {
        const range = BanhRangTru.layKhoangHieuSuat(capChinhXac, cheKin)
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
                return { min: 0.96, max: 0.98 }
            }
            else if (capChinhXac >= 6 && capChinhXac <= 7) {
                return { min: 0.97, max: 0.99 }
            }
            else {
                throw new Error(`${capChinhXac} is out of [${BanhRangTru.CAP_CHINH_XAC_MIN}, ${BanhRangTru.CAP_CHINH_XAC_MAX}] range.`)
            }
        } 
        else {
            if (capChinhXac >= 8 && capChinhXac <= 9) {
                return { min: 0.93, max: 0.95 }
            }
            else if (capChinhXac >= 6 && capChinhXac <= 7) {
                return { min: 0.94, max: 0.96 }
            }
            else {
                throw new Error(`${capChinhXac} is out of [${BanhRangTru.CAP_CHINH_XAC_MIN}, ${BanhRangTru.CAP_CHINH_XAC_MAX}] range.`)
            }
        }
    }
}