import { BoTruyen } from "../builders.interface/BoTruyen.interface.js"
export class OLan extends BoTruyen {
    static HIEU_SUAT_MIN = 0.99
    static HIEU_SUAT_MAX = 0.995
    static HIEU_SUAT_DEFAULT = 0.995
    #hieuSuat
    #taituongduong
    #tuoithoL10
    #momenXoan
    #LoaiOlan
    /**
     * 
     * @param {{
     *   hieuSuat?: number,
     *   taituongduong?: number,
     *   tuoithoL10?: number,
     *   momenXoan?: number,
     *   LoaiOlan?: string
     * }} param0 
     */
    constructor({hieuSuat = OLan.HIEU_SUAT_DEFAULT, taituongduong, tuoithoL10, momenXoan, LoaiOlan} = {}) {
        super()
        if (!OLan.kiemTraHieuSuat(hieuSuat)) {
            throw new Error(`${hieuSuat} is out of [${OLan.HIEU_SUAT_MIN}, ${OLan.HIEU_SUAT_MAX}] range.`)
        }
        this.#hieuSuat = hieuSuat
        this.#taituongduong = taituongduong
        this.#tuoithoL10 = tuoithoL10
        this.#momenXoan = momenXoan
        this.#LoaiOlan = LoaiOlan
    }

    // Kiểm tra hiệu suất hợp lệ theo bảng 2.3 trang 19
    static kiemTraHieuSuat(hieuSuat) {
        return (hieuSuat >= OLan.HIEU_SUAT_MIN && hieuSuat <= OLan.HIEU_SUAT_MAX)
    }

    // getter hieuSuat
    getHieuSuat() {
        return this.#hieuSuat
    }
    getTaituongduong() {
        return this.#taituongduong
    }
    getTuoiThoL10() {
        return this.#tuoithoL10
    }
    getMomenXoan() {
        return this.#momenXoan
    }
    getLoaiOlan(){
        return this.#LoaiOlan
    }
    
}