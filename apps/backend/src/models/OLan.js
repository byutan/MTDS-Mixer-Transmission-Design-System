import { BoTruyen } from "../builders.interface/BoTruyen.interface.js"
export class OLan extends BoTruyen {
    static HIEU_SUAT_MIN = 0.99
    static HIEU_SUAT_MAX = 0.995
    static HIEU_SUAT_DEFAULT = 0.995
    #hieuSuat
    constructor({hieuSuat = OLan.HIEU_SUAT_DEFAULT} = {}) {
        super()
        if (!OLan.kiemTraHieuSuat(hieuSuat)) {
            throw new Error(`${hieuSuat} is out of [${OLan.HIEU_SUAT_MIN}, ${OLan.HIEU_SUAT_MAX}] range.`)
        }
        this.#hieuSuat = hieuSuat
    }

    // Kiểm tra hiệu suất hợp lệ theo bảng 2.3 trang 19
    static kiemTraHieuSuat(hieuSuat) {
        return (hieuSuat >= OLan.HIEU_SUAT_MIN && hieuSuat <= OLan.HIEU_SUAT_MAX)
    }

    // getter hieuSuat
    getHieuSuat() {
        return this.#hieuSuat
    }
}