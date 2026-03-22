import { BoTruyen } from "../builders.interface/BoTruyen.interface.js";
import { Truc } from "../models/Truc.js"
import { BanhRangCon } from "./BanhRangCon.js";
import { BanhRangTru } from "./BanhRangTru.js";
import { chuyenSoLaMa }  from "../utils/utils.js";
export class HopGiamToc extends BoTruyen{
    static TY_SO_TRUYEN_SB_MIN = 10
    static TY_SO_TRUYEN_SB_MAX = 25
    static TY_SO_TRUYEN_SB_DEFAULT = 11.5
    
    #danhSachBoTruyen = [];
    #danhSachTruc = []
    #tySoTruyenSoBo
    /**
     * @param {{ 
     * cacBoTruyen?: BoTruyen[],
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
        this.#addTruc();
    }

    // Kiểm tra hiệu suất hợp lệ theo bảng 2.4 trang 21
    static kiemTraTySoTruyenSoBo(tySoTruyenSoBo) {
        return (tySoTruyenSoBo >= HopGiamToc.TY_SO_TRUYEN_SB_MIN && tySoTruyenSoBo <= HopGiamToc.TY_SO_TRUYEN_SB_MAX)
    }

    // Hàm khởi tạo danh sách trục
    #addTruc() {
        const soTruc = this.getSoCap() + 1;
        this.#danhSachTruc = [];
        for (let i = 1; i <= soTruc; i++) {
            this.#danhSachTruc.push(new Truc({
                tenTruc: `${chuyenSoLaMa(i)}`, // Tự động convert i thành I, II, III...
                congSuat: 0,      
                tySoTruyen: null, 
                soVongQuay: 0,    
                momentXoan: 0     
            }));
        }

    }
    // Thêm bộ truyền vào động cơ
    addBoTruyen(boTruyen) {
        if (!(boTruyen instanceof BoTruyen)) {
            throw new Error("Only BoTruyen object is allowed.");
        }
        this.#danhSachBoTruyen.push(boTruyen);
        this.#addTruc();
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

    // getter danhSachTruc
    getDanhSachTruc() {
        return this.#danhSachTruc;
    }


    // getter danhSachBoTruyen
    getDanhSachBoTruyen() {
        return this.#danhSachBoTruyen;
    }

    // hàm tính tỷ số truyền thực tế
    tinhTySoTruyenThucTe(tySoTruyenChungThucTe, tySoTruyenDai) {
        if (!tySoTruyenDai || tySoTruyenDai === 0) {
            throw new Error("Inappropriate value: tySoTruyenDai");
        }
        return tySoTruyenChungThucTe / tySoTruyenDai;
    }

    // hàm phân phối tỷ số truyền
    phanPhoiTySoTruyenCacCap({ u_h, k_be, psi_bd2, c_k}) {
        if (!u_h || !k_be || !psi_bd2) {
            throw new Error("Missing value.");
        }
        let u_con = null
        const lambda_k = (2.25 * psi_bd2) / ((1 - k_be) * k_be);
        const ketQua = [];
        for (const boTruyen of this.#danhSachBoTruyen) {
            let u_boTruyen = 0;
            let loaiBanhRang = boTruyen.constructor.name;
            if (boTruyen instanceof BanhRangCon) {
                u_boTruyen = boTruyen.tinhTySoTruyen({ u_h, lambda_k, c_k });
                u_con = u_boTruyen
            } else if (boTruyen instanceof BanhRangTru) {
                if (!u_con) {
                    throw new Error("Missing value.");
                }
                u_boTruyen = boTruyen.tinhTySoTruyen({ u_h, u_con })
            }
            ketQua.push({
                loai: loaiBanhRang,
                tySoTruyen: u_boTruyen
            });
        }
        return ketQua
    }
}