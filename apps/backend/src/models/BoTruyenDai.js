import { BoTruyen } from "../builders.interface/BoTruyen.interface.js"
export class BoTruyenDai extends BoTruyen {
    static HIEU_SUAT_MIN = 0.95
    static HIEU_SUAT_MAX = 0.96
    static HIEU_SUAT_DEFAULT = 0.955

    static TY_SO_TRUYEN_SB_MIN = 3
    static TY_SO_TRUYEN_SB_MAX = 5
    static TY_SO_TRUYEN_SB_DEFAULT = 3.6
    #hieuSuat
    #tySoTruyenSoBo
    /**
     * @param {{ 
     * hieuSuat?: number
     * tySoTruyenSoBo?: number   
     * }} params
     */
    constructor({ hieuSuat = BoTruyenDai.HIEU_SUAT_DEFAULT, tySoTruyenSoBo = BoTruyenDai.TY_SO_TRUYEN_SB_DEFAULT} = {}) {
        super()
        if (!BoTruyenDai.kiemTraHieuSuat(hieuSuat)) {
            throw new Error(`${hieuSuat} is out of [${BoTruyenDai.HIEU_SUAT_MIN}, ${BoTruyenDai.HIEU_SUAT_MAX}] range.`)
        } else if (!BoTruyenDai.kiemTraTySoTruyenSoBo(tySoTruyenSoBo)) {
            throw new Error(`${tySoTruyenSoBo} is out of [${BoTruyenDai.TY_SO_TRUYEN_SB_MIN}, ${BoTruyenDai.TY_SO_TRUYEN_SB_MAX}] range.`)
        }
        this.#hieuSuat = hieuSuat
        this.#tySoTruyenSoBo = tySoTruyenSoBo
    }
    
    // Kiểm tra hiệu suất hợp lệ theo bảng 2.3 trang 19
    static kiemTraHieuSuat(hieuSuat) {
        return (hieuSuat >= BoTruyenDai.HIEU_SUAT_MIN && hieuSuat <= BoTruyenDai.HIEU_SUAT_MAX)
    }
    
    // Kiểm tra hiệu suất hợp lệ theo bảng 2.4 trang 21
    static kiemTraTySoTruyenSoBo(tySoTruyenSoBo) {
        return (tySoTruyenSoBo >= BoTruyenDai.TY_SO_TRUYEN_SB_MIN && tySoTruyenSoBo <= BoTruyenDai.TY_SO_TRUYEN_SB_MAX)
    }
    
    // getter hieuSuat
    getHieuSuat() {
        return this.#hieuSuat
    }

    // getter tySoTruyenSoBo
    getTySoTruyenSoBo() {
        return this.#tySoTruyenSoBo
    }
}
