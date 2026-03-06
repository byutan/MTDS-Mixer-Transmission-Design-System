import { BoTruyen } from "../builders.interface/BoTruyen.interface.js"
export class NoiTrucVongDanHoi extends BoTruyen {
    static HIEU_SUAT_DEFAULT = 1
    #hieuSuat
    /**
     * @param {{ 
     * hieuSuat?: number
     * }} params
     */
    constructor({hieuSuat = NoiTrucVongDanHoi.HIEU_SUAT_DEFAULT} = {}) {
        super()
        this.#hieuSuat = hieuSuat;
    }
    getHieuSuat() {
        return this.#hieuSuat
    }
}