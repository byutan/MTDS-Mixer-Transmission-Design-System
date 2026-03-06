

export class ThungTron {
    /**
     * @param {{ 
     * congSuat?: number,   // P (kW) - Công suất trên trục thùng trộn
     * soVongQuay?: number, // n (vòng/phút) - Số vòng quay trục thùng trộn
     * moMen?: number,      // T (N.mm) - Mô men xoắn
     * thoiGianPhucVu?: number // h (giờ) - Tuổi thọ yêu cầu
     * }} params
     */
    #congSuat;
    #soVongQuay;
    #thoiGianPhucVu;
    constructor({congSuat, soVongQuay, thoiGianPhucVu} = {}) {
        if (congSuat <= 0 || soVongQuay <= 0 || thoiGianPhucVu <= 0) {
            throw new Error("Mixer stats must be greater than 0.");
        }
        this.#congSuat = congSuat;
        this.#soVongQuay = soVongQuay;
        this.#thoiGianPhucVu = thoiGianPhucVu;
    }
    getCongSuat() {
        return this.#congSuat;
    }

    getSoVongQuay() {
        return this.#soVongQuay;
    }

    getThoiGianPhucVu() {
        return this.#thoiGianPhucVu;
    }
}