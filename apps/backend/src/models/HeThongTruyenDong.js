import { DongCo } from "../models/DongCo.js"
import { HopGiamToc } from "../models/HopGiamToc.js"
import { NoiTrucVongDanHoi } from "../models/NoiTrucVongDanHoi.js"
import { BoTruyenDai } from "./BoTruyenDai.js";
import { OLan } from "./OLan.js";
import { ThungTron } from "./ThungTron.js";
export class HeThongTruyenDong {
    /**
     * @param {{ 
     * dongCo: DongCo,
     * hopGiamToc: HopGiamToc,
     * noiTrucVongDanHoi: NoiTrucVongDanHoi,
     * boTruyenDai: BoTruyenDai,
     * oLan: OLan,
     * thungTron: ThungTron
     *  }} params
     */
    constructor({ dongCo, hopGiamToc, noiTrucVongDanHoi, boTruyenDai, oLan, thungTron }) {
        this.dongCo = dongCo;
        this.hopGiamToc = hopGiamToc;
        this.noiTrucVongDanHoi = noiTrucVongDanHoi
        this.boTruyenDai = boTruyenDai
        this.oLan = oLan
        this.thungTron = thungTron
    }
    // hàm tính hiệu suất chung hệ thống
    tinhHieuSuatHeThong() {
        const soTruc = this.hopGiamToc.getSoCap() + 1
        return this.noiTrucVongDanHoi.getHieuSuat() 
        * this.boTruyenDai.getHieuSuat() 
        * this.hopGiamToc.getHieuSuat() 
        * Math.pow(this.oLan.getHieuSuat(), soTruc)
    }
    // hàm tính tỷ số truyền chung sơ bộ
    tinhTySoTruyenChungSoBo() {
        const tySoTruyenHGT = this.hopGiamToc.getTySoTruyenSoBo()
        const tySoTruyenDai = this.boTruyenDai.getTySoTruyenSoBo()
        return tySoTruyenHGT * tySoTruyenDai
    }

    // hàm tính tỷ số truyền tổng thực tế
    tinhTySoTruyenChungThucTe() {
        const vanTocQuay = this.dongCo.getVanTocQuay()
        const soVongQuay = this.thungTron.getSoVongQuay()
        return vanTocQuay / soVongQuay
    }
}