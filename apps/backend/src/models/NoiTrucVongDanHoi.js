import { BoTruyen } from "../builders.interface/BoTruyen.interface.js"
export class NoiTrucVongDanHoi extends BoTruyen {
    static HIEU_SUAT_DEFAULT = 1
    static TY_SO_TRUYEN_SO_BO_DEFAULT = 1
    #hieuSuat
    #tySoTruyenSoBo
    /**
     * @param {{ 
     * hieuSuat?: number
     * tySoTruyenSoBo?: number
     * }} params
     */
    constructor({hieuSuat = NoiTrucVongDanHoi.HIEU_SUAT_DEFAULT, tySoTruyenSoBo = NoiTrucVongDanHoi.TY_SO_TRUYEN_SO_BO_DEFAULT} = {}) {
        super()
        this.#hieuSuat = hieuSuat;
        this.#tySoTruyenSoBo = tySoTruyenSoBo;
    }
    getHieuSuat() {
        return this.#hieuSuat
    }

    getTySoTruyenSoBo() {
        return this.#tySoTruyenSoBo
    }
}