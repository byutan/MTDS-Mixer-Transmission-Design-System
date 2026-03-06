import { BanhRangCon } from "./BanhRangCon.js";
import { BanhRangTru } from "./BanhRangTru.js";
import { BoTruyen } from "../builders.interface/BoTruyen.interface.js";
export class HopGiamToc extends BoTruyen{
    static TY_SO_TRUYEN_SB_MIN = 10
    static TY_SO_TRUYEN_SB_MAX = 25
    static TY_SO_TRUYEN_SB_DEFAULT = 11.5
    
    #danhSachBoTruyen = [];
    #tySoTruyenSoBo
    /**
     * @param {{ 
     * cacBoTruyen?: BoTruyen[]
     * tySoTruyenSoBo?: number
     * }} params
     */
    constructor({ danhSachBoTruyen = [], tySoTruyenSoBo = HopGiamToc.TY_SO_TRUYEN_SB_DEFAULT} = {}) {
        super()
        if (Array.isArray(danhSachBoTruyen)) {
            this.#danhSachBoTruyen = danhSachBoTruyen.filter(boTruyen => boTruyen instanceof BoTruyen)
        } 
        if (!HopGiamToc.kiemTraTySoTruyenSoBo(tySoTruyenSoBo)) {
            throw new Error(`${tySoTruyenSoBo} is out of [${HopGiamToc.TY_SO_TRUYEN_SB_MIN}, ${HopGiamToc.TY_SO_TRUYEN_SB_MAX}] range.`)
        }
        this.#tySoTruyenSoBo = tySoTruyenSoBo
    }

    // Kiểm tra hiệu suất hợp lệ theo bảng 2.4 trang 21
    static kiemTraTySoTruyenSoBo(tySoTruyenSoBo) {
        return (tySoTruyenSoBo >= HopGiamToc.TY_SO_TRUYEN_SB_MIN && tySoTruyenSoBo <= HopGiamToc.TY_SO_TRUYEN_SB_MAX)
    }

    // Thêm bộ truyền vào động cơ
    addBoTruyen(boTruyen) {
        if (!(boTruyen instanceof BoTruyen)) {
            throw new Error("Only BoTruyen object is allowed.");
            return;
        }
        this.#danhSachBoTruyen.push(boTruyen);
    }

    // override method
    getHieuSuat() {
        if (this.#danhSachBoTruyen.length === 0) {
            return 0;
        } else {
            return this.#danhSachBoTruyen.reduce((hieuSuatHGT, boTruyen) => {
                return hieuSuatHGT * boTruyen.getHieuSuat();
            }, 1)
        }
    }

    // getter soCap
    getSoCap() {
        return this.#danhSachBoTruyen.length
    }

    // getter tySoTruyenSoBo
    getTySoTruyenSoBo() {
        return this.#tySoTruyenSoBo
    }
}