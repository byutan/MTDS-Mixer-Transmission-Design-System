import { DongCo } from "../models/DongCo.js"
import { HopGiamToc } from "../models/HopGiamToc.js"
import { NoiTrucVongDanHoi } from "../models/NoiTrucVongDanHoi.js"
import { BoTruyenDai } from "./BoTruyenDai.js";
import { OLan } from "./OLan.js";
import { ThungTron } from "./ThungTron.js";
import { Truc } from "./Truc.js";
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
    // hàm tính đặc tính kỹ thuật
    tinhBangDacTinhKyThuat(ketQuaPhanPhoiTySoTruyen) {
        if (!ketQuaPhanPhoiTySoTruyen?.tySoTruyenBanhRang) {
            throw new Error("Please do calculation of phanPhoiTySoTruyen to continue.");
        }
        const Pdc = this.dongCo.getCongSuat(); 
        const ndc = this.dongCo.getVanTocQuay();
        const tinhMomment = (P, n) => 9.55 * Math.pow(10,6) * (P/n)

        const BangDacTinhKyThuat = []
        BangDacTinhKyThuat.push({
            truc: "Dong Co",
            congSuat: Pdc,
            tySoTruyen: "-",
            momenXoan: tinhMomment(Pdc, ndc),
            soVongQuay: ndc
        })
        const danhSachBoTruyen = this.hopGiamToc.getDanhSachBoTruyen()
        const danhSachTySoTruyenBanhRang = ketQuaPhanPhoiTySoTruyen.tySoTruyenBanhRang;
        const chuoiTruyen = []
        chuoiTruyen.push({
            ten: "Dai",
            tySoTruyen: this.boTruyenDai.getTySoTruyenSoBo(),
            hieuSuat: this.boTruyenDai.getHieuSuat(),
            nhanOLan: true 
        })

        danhSachBoTruyen.forEach(bt=> {
            const tenBanhRang = bt.constructor.name
            const tySoTruyenBanhRang = danhSachTySoTruyenBanhRang.find(item => item.loai == tenBanhRang)
            if(!tySoTruyenBanhRang) {
                throw new Error(`TySoTruyen missing for ${tenBanhRang}`)
            }
            chuoiTruyen.push({
                ten: tenBanhRang,
                tySoTruyen: tySoTruyenBanhRang.tySoTruyen,
                hieuSuat: bt.getHieuSuat(),
                nhanOLan: true
            });
        })
        chuoiTruyen.push({
            ten: "Khop noi",
            tySoTruyen: this.noiTrucVongDanHoi.getTySoTruyenSoBo(),
            hieuSuat: this.noiTrucVongDanHoi.getHieuSuat(),
            nhanOLan: false 
        });
        let P = Pdc;
        let n = ndc;
        const hieuSuatOLan = this.oLan.getHieuSuat();
        const danhSachTruc = this.hopGiamToc.getDanhSachTruc();
        chuoiTruyen.forEach((tram, idx) => {
            const hieuSuatNhanOLan = tram.nhanOLan ? hieuSuatOLan : 1
            P = P * tram.hieuSuat * hieuSuatNhanOLan
            n = n / tram.tySoTruyen;
            const T = tinhMomment(P,n)
            let tenTruc=""
            if(idx < danhSachTruc.length) {
                const truc = danhSachTruc[idx]
                tenTruc=truc.getTenTruc()
                truc.congSuat = Number(P.toFixed(3))
                truc.soVongQuay = Math.round(n);
                truc.momentXoan = Number(T.toFixed(3))
                truc.tySoTruyen = Number(tram.tySoTruyen.toFixed(3))
            } else {
                tenTruc = "Cong tac"
            }
            BangDacTinhKyThuat.push({
                truc: tenTruc,
                congSuat: P,
                tySoTruyen: tram.tySoTruyen,
                soVongQuay: n,
                momenXoan: T
            })
        })
        return BangDacTinhKyThuat.map(row => ({
            "truc": row.truc,
            "congSuat": Number(row.congSuat.toFixed(3)),
            "tySoTruyen": row.tySoTruyen === "-" ? "-" : Number(row.tySoTruyen.toFixed(2)),
            "soVongQuay": Math.round(row.soVongQuay),
            "momentXoan": Math.round(row.momenXoan.toFixed(3))
        }));
    }
}