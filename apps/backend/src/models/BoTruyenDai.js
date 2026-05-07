import { BoTruyen } from "../builders.interface/BoTruyen.interface.js"
export class BoTruyenDai extends BoTruyen {
    static HIEU_SUAT_MIN = 0.95
    static HIEU_SUAT_MAX = 0.96
    static HIEU_SUAT_DEFAULT = 0.955

    static TY_SO_TRUYEN_SB_MIN = 3
    static TY_SO_TRUYEN_SB_MAX = 5
    static TY_SO_TRUYEN_SB_DEFAULT = 3.6

    static DUONG_KINH_SO_BO_DEFAULT = 140
    static DUONG_KINH_BANH_DAN_DEFAULT = 500
    static CHIEU_DAI_DAI_DEFAULT = 2240
    #hieuSuat
    #tySoTruyenSoBo
    // thong so chi tiet bo truyen dai
    #bp
    #bo
    #h
    #yo
    #A
    #d1
    #L
    #lo
    /**
     * @param {{ 
     * hieuSuat?: number
     * tySoTruyenSoBo?: number
     * bp?: number
     * bo?: number
     * h?: number
     * yo?: number
     * A?: number
     * d1?: number
     * L?: number
     * lo?: number
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
    // setter tietDienDai
    setTietDienDai(congSuat, vanTocQuay) {
        if (congSuat > 400 || vanTocQuay < 200) {
            throw new Error(`${congSuat} or ${vanTocQuay} is out of bound`)
        } 
        const k = vanTocQuay/congSuat
        if (k >= 250) {
            return 'A'
        } else if (k >= 63.6 && k < 250){
            return 'B'
        } else if (k >= 10 && k < 63.6){
            return 'C'
        } else if (k >= 4 && k < 10){
            return 'D'
        } else if (k < 4){
            return 'E'
        }
    }
    setThongSoDai(tietDienDai) {
        if (tietDienDai === 'A') {
            this.#bp = 11
            this.#bo =13
            this.#h = 8
            this.#yo = 2.8
            this.#A = 81
            this.#d1 = BoTruyenDai.DUONG_KINH_SO_BO_DEFAULT
            this.#lo = 1700
        }
        else if (tietDienDai === 'B') {
            this.#bp = 14
            this.#bo = 17
            this.#h = 11
            this.#yo = 4.2
            this.#A = 138
            this.#d1 = 125 
            this.#lo = 2000
        }
    }
    getDuongKinhSoBo() {
        return this.#d1
    }

    getLo(){
        return this.#lo
    }
    getThongSoT(tietDienDai) {
        if (tietDienDai === 'A') return 15
        if (tietDienDai === 'B') return 19
    }
    
    getThongSoE(tietDienDai) {
        if (tietDienDai === 'A') return 10
        if (tietDienDai === 'B') return 12.5
    }
    
    getThongSoH0(tietDienDai) {
        if (tietDienDai === 'A') return 3.3
        if (tietDienDai === 'B') return 4.2
    }
    
    getKhoiLuong1MChieuDaiDai(tietDienDai) {
        if (tietDienDai === 'A') return 0.105
        if (tietDienDai === 'B') return 0.18
    }
}
