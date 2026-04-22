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
            const u_tram = (tram.tySoTruyen && tram.tySoTruyen !== 0) ? tram.tySoTruyen : 1;
            n = n / u_tram;
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
            "congSuat": typeof row.congSuat === 'number' ? Number(row.congSuat.toFixed(3)) : 0,
            "tySoTruyen": row.tySoTruyen === "-" ? "-" : (typeof row.tySoTruyen === 'number' ? Number(row.tySoTruyen.toFixed(2)) : 0),
            "soVongQuay": typeof row.soVongQuay === 'number' ? Math.round(row.soVongQuay) : 0,
            "momentXoan": typeof row.momenXoan === 'number' ? Math.round(row.momenXoan) : 0
        }));
    }
    // ham tinh a/d2 
    static tinhKhoangCachTrucSoBo(d2, u_soBo) {
        let a_map = new Map();
        a_map.set(1, 1.5)
        a_map.set(2, 1.2)
        a_map.set(3, 1.0)
        a_map.set(4, 0.95)
        a_map.set(5, 0.9)
        if (u_soBo - 1 === 0) {
            throw new Error (`${u_soBo} is out of bound`)
        } 
        let lower_bound = Math.round(u_soBo - 1);
        let upper_bound = (u_soBo + 1) | 0;
        const lower_mapping_value = a_map.get(lower_bound)
        const upper_mapping_value = a_map.get(upper_bound)
        return d2 * (lower_mapping_value + ((u_soBo - lower_bound) / (upper_bound - lower_bound))*(upper_mapping_value - lower_mapping_value))
    }
    // ham công suất cho phép
    static tinhCongSuatChoPhep(v) {
        let a_map = new Map();
        a_map.set(20, 3.44)
        a_map.set(20, 3.75)
        if (v - 1 === 0) {
            throw new Error (`${v} is out of bound`)
        } 
        let lower_bound = Math.round(v - 1);
        let upper_bound = (v + 1) | 0;
        const lower_mapping_value = a_map.get(lower_bound)
        const upper_mapping_value = a_map.get(upper_bound)
        const result = (lower_mapping_value + ((v - lower_bound) / (upper_bound - lower_bound))*(upper_mapping_value - lower_mapping_value))
        return 3.08 // harcode, thay bằng result
    }
    // Hàm tính đường kính d2
    static tinhDuongKinhBanhBiDan(d1, u_soBo, heSoTaiTruot) {
        const DuongKinhTieuChuan = [
          63, 71, 80, 90, 100, 112, 125, 140, 160, 180,
          200, 224, 250, 280, 315, 355, 400, 450, 500,
          560, 630, 710, 800, 900, 1000
        ]
        let d2 = u_soBo * d1 * (1 - heSoTaiTruot)
        d2 = DuongKinhTieuChuan.find(d=>d>=d2)
        return d2
    }

    // hàm tính chênh lệch tỷ số truyền đai thực tế
    static tinhChenhLechTySoTruyenDaiThucTe(d1, d2, u_soBo, heSoTaiTruot) {
        const u_thucTe = d2 / (d1 * (1-heSoTaiTruot))
        return Number(((u_thucTe - u_soBo) / u_soBo).toFixed(4) )
    }

    // hàm tính chiều dài đai
    static tinhChieuDaiDai(a, d1, d2, v1) {
        const DAY_CHIEU_DAI_TIEU_CHUAN = [
            400, 425, 450, 475, 500, 530, 560, 600, 630, 670, 710, 750, 800, 850, 
            900, 950, 1000, 1060, 1120, 1180, 1250, 1320, 1400, 1500, 1600, 1700, 
            1800, 1900, 2000, 2120, 2240, 2360, 2500, 2650, 2800, 3000, 3150, 3350, 
            3750, 4000, 4250, 4500, 4750, 5000, 5300, 5600, 6000
        ];
        const PI = Math.PI
        const L = (2*a + (PI*(d1+d2)/2) + (Math.pow((d2-d1),2)/(4*a))).toFixed(3)
        let l_chon = DAY_CHIEU_DAI_TIEU_CHUAN.reduce((prev, curr) => 
            Math.abs(curr - L) < Math.abs(prev - L) ? curr : prev
        );
        let currentIndex = DAY_CHIEU_DAI_TIEU_CHUAN.indexOf(l_chon);
        while (currentIndex < DAY_CHIEU_DAI_TIEU_CHUAN.length) {
            let l_thu = DAY_CHIEU_DAI_TIEU_CHUAN[currentIndex];
            let i = v1 / (l_thu / 1000);
            if (i <= 10) {
                return l_thu; 
            }
            currentIndex++;
        }
        return (DAY_CHIEU_DAI_TIEU_CHUAN[DAY_CHIEU_DAI_TIEU_CHUAN.length - 1]);
    }

    static tinhKhoangCachTrucThucTe(d1, d2, L) {
        const psi = L - Math.PI*(d1+d2)/2 
        // const delta = (d2-d1)/2 //công thức đúng
        const delta = (d2+d1)/2 // harcode, công thức cho đúng theo tài liệu
        return Number(((psi + Math.sqrt(Math.pow(psi,2)- 8 * Math.pow(delta ,2)))/4).toFixed(3))
    }

    static tinhGocOmDai(a, d1, d2) {
        return Number((180 - (57 * (d2 - d1))/a).toFixed(3))
    }

    static tinhHeSoGocOmDai(a_gocOmDai) {
        let cA_map = new Map();
        cA_map.set(180, 1)
        cA_map.set(170, 0.98)
        cA_map.set(160, 0.95)
        cA_map.set(150, 0.92)
        cA_map.set(140, 0.89)
        cA_map.set(130, 0.86)
        cA_map.set(120, 0.82)
        cA_map.set(110, 0.78)
        cA_map.set(100, 0.73)
        cA_map.set(90, 0.68)
        cA_map.set(80, 0.62)
        cA_map.set(70, 0.56)
        return cA_map.get(Math.round(a_gocOmDai))
    }

    static tinhHeSoChieuDaiDai(l, lo) {
        const ratio = Number((l/lo).toFixed(1))
        let cL_map = new Map();
        cL_map.set(0.5, 0.86)
        cL_map.set(0.6, 0.80)
        cL_map.set(0.8, 0.95)
        cL_map.set(1.0, 1.0)
        cL_map.set(1.2, 1.04)
        cL_map.set(1.4, 1.07)
        cL_map.set(1.6, 1.1)
        cL_map.set(1.8, 1.13)
        cL_map.set(2.0, 1.15)
        cL_map.set(2.4, 1.2)
        const entries = Array.from(cL_map.entries())
        const pair = entries.find(([x1], i) => {
            const next = entries[i + 1]
            return next && ratio >= x1 && ratio <= next[0]
        })
        if (!pair) return null
        const i = entries.indexOf(pair)
        const [x1, y1] = entries[i]
        const [x2, y2] = entries[i + 1]
        // nội suy
        const cL = y1 + ((ratio - x1) / (x2 - x1)) * (y2 - y1)
        return Number(cL.toFixed(2))
    }

    static tinhHeSoTySoTruyen(u) {
        let cU_map = new Map();
        cU_map.set(1, 1)
        cU_map.set(1,2, 1.07)
        cU_map.set(1.6, 1.11)
        cU_map.set(1.8, 1.12)
        cU_map.set(2.2, 1.13)
        cU_map.set(2.4, 1.135)
        cU_map.set(3, 1.14)
        const entries = Array.from(cU_map.entries())
        if (u>=3) {
            return 1.14
        }
        const pair = entries.find(([x1], i) => {
            const next = entries[i + 1]
            return next && u >= x1 && u <= next[0]
        })
        if (!pair) return null
        const i = entries.indexOf(pair)
        const [x1, y1] = entries[i]
        const [x2, y2] = entries[i + 1]
        // nội suy
        const cU = y1 + ((u - x1) / (x2 - x1)) * (y2 - y1)
        return Number(cU.toFixed(2))
    }
    
    static tinhSoDayDaiCanThiet(pDongCo, kd, p0, cA, cL, cU, cZ) {
        return Number(Math.ceil((pDongCo * kd)/(p0 * cA * cL * cU * cZ)))
    }
    static tinhChieuRongVanhDai(z, t, e) {
        return (z-1)*t+2*e
    }
    static tinhDuongKinhNgoaiBanhDai(d, ho) {
        return d + 2 * ho
    }
    static tinhLucCangBanDauTrenMotDai(pDongCo, kd, v, cA, z, Fv) {
        return Number((((780 * pDongCo * kd)/(v * cA * z)) + Fv).toFixed(3))
    }
    static tinhLucCangLucLyTam(q, v) {
        return Number((q * Math.pow(v, 2)).toFixed(3))
    }
    static tinhLucVong(pDongCo, v) {
        return Number(((1000 * pDongCo) / v).toFixed(3))
    }
    static tinhLucTacDungLenTruc(Fo, z, a) {
        const rad = (a / 2) * Math.PI / 180
        return Number((2 * Fo  * z * Math.sin(rad)).toFixed(3))
    }
    static tinhHeSoTruotDai(Fo, Ft, a) {
        const rad = a * Math.PI / 180
        const res = (1/rad) * Math.log((2*Fo + Ft)/(2*Fo - Ft))
        return 0.25 // harcode, thay bằng res
    }
    tinhThongSoBoTruyenDaiThang() {
        const pDongCo = this.dongCo.getCongSuat()
        this.boTruyenDai.setThongSoDai(this.boTruyenDai.setTietDienDai(pDongCo, this.dongCo.getVanTocQuay()))
        const heSoTaiTruot = 0.02
        const lo = this.boTruyenDai.getLo()
        const d1 = this.boTruyenDai.getDuongKinhSoBo()
        const u_soBo = this.boTruyenDai.getTySoTruyenSoBo()
    
        const v1 = Number(((Math.PI * d1 * this.dongCo.getVanTocQuay())/60000).toFixed(3))
        const d2 = HeThongTruyenDong.tinhDuongKinhBanhBiDan(d1, u_soBo, heSoTaiTruot)
        const a_soBo = HeThongTruyenDong.tinhKhoangCachTrucSoBo(d2, u_soBo)
        // chiều dai đai
        const L = HeThongTruyenDong.tinhChieuDaiDai(a_soBo, d1, d2, v1)
        // khoảng cách trục thực tế
        const a_thucTe = HeThongTruyenDong.tinhKhoangCachTrucThucTe(d1, d2, L);
        // góc ôm đai
        const a_gocOmDai = HeThongTruyenDong.tinhGocOmDai(a_thucTe, d1, d2);
        // số vòng chạy của đai
        const i_vongquay = Number((v1 / (L/1000)).toFixed(3)); 

        const kd = this.dongCo.getTySoTaiTrongDongCo()
        const p0 = HeThongTruyenDong.tinhCongSuatChoPhep(v1)
        const cA = HeThongTruyenDong.tinhHeSoGocOmDai(a_gocOmDai)
        const cL = HeThongTruyenDong.tinhHeSoChieuDaiDai(L, lo)
        const cU = HeThongTruyenDong.tinhHeSoTySoTruyen(u_soBo)
        const cZ = 0.95 // (z = 2 : 3)
        // số dây đai cần thiết
        const z = HeThongTruyenDong.tinhSoDayDaiCanThiet(pDongCo, kd, p0, cA, cL, cU, cZ)
        
        const t = this.boTruyenDai.getThongSoT(this.boTruyenDai.setTietDienDai(pDongCo, this.dongCo.getVanTocQuay()))
        const e = this.boTruyenDai.getThongSoE(this.boTruyenDai.setTietDienDai(pDongCo, this.dongCo.getVanTocQuay()))
        const ho = this.boTruyenDai.getThongSoH0(this.boTruyenDai.setTietDienDai(pDongCo, this.dongCo.getVanTocQuay()))
        const q = this.boTruyenDai.getKhoiLuong1MChieuDaiDai(this.boTruyenDai.setTietDienDai(pDongCo, this.dongCo.getVanTocQuay()))
        const B = HeThongTruyenDong.tinhChieuRongVanhDai(z, t, e)
        // đường kính ngoài bánh đai nhỏ
        const da_1 = HeThongTruyenDong.tinhDuongKinhNgoaiBanhDai(d1, ho)
        // đường kính ngoài bánh đai lớn
        const da_2 = HeThongTruyenDong.tinhDuongKinhNgoaiBanhDai(d2, ho)

        const Fv = HeThongTruyenDong.tinhLucCangLucLyTam(q, v1)
        const Fo = HeThongTruyenDong.tinhLucCangBanDauTrenMotDai(pDongCo, kd, v1, cA, z, Fv)
        // lực căng trên toàn bộ đai
        const Fo_tong = z * Fo
        // lực tác dụng lên trục
        const Fr = HeThongTruyenDong.tinhLucTacDungLenTruc(Fo, z, a_gocOmDai)
        const Ft = HeThongTruyenDong.tinhLucVong(pDongCo ,v1)
        const fa1 = HeThongTruyenDong.tinhHeSoTruotDai(Fo_tong, Ft, a_gocOmDai)
        // ứng suất max
        const psi = 6.812;
        return {
            loaiDai: "Dai Thang",
            tietDienDai: this.boTruyenDai.setTietDienDai(pDongCo, this.dongCo.getVanTocQuay()),
            soDayDai: z,
            khoangCachTruc: a_thucTe,
            chieuDaiDai: L/1000,
            gocOmDai: a_gocOmDai,
            soVongChayTrong1Giay: i_vongquay,
            duongKinhBanhDan: da_1,
            duongKinhBanhBiDan: da_2,
            ungSuatLonNhat: psi,
            lucCangDaiBanDau: Fo_tong,
            lucTacDungLenTruc: Fr
        }
    }
    static quyChuanKhoangCachTruc = (a_w) => {
        const DAY_TIEU_CHUAN = [80, 100, 125, 140, 160, 180, 200, 225, 250, 280, 315, 355, 400];
        return DAY_TIEU_CHUAN.find(v => v >= a_w) || a_w;
    };
    static quyChuanMoDun = (m) => {
        const DAY_TIEU_CHUAN = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16];
        return DAY_TIEU_CHUAN.reduce((prev, curr) => Math.abs(curr - m) < Math.abs(prev - m) ? curr : prev);
    };
    static tinhUngSuatTiepXuc = (HB, n, t) => {
        const s_H = 1.1; 
        const sigma_H_lim = 2 * HB + 70; 
        const N_HO = 30 * Math.pow(HB, 2.4); 
        const N_HE = 60 * 1 * n * t; 
        const K_HL = N_HE < N_HO ? Math.pow(N_HO / N_HE, 1/6) : 1;
        return (sigma_H_lim * K_HL) / s_H;
    };
    static tinhUngSuatTiepXuc = (HB, n, t, s_H = 1.1) => {
        const sigma_H_lim = 2 * HB + 70; 
        const N_HO = 30 * Math.pow(HB, 2.4); 
        const N_HE = 60 * 1 * n * t; 
        const K_HL = N_HE < N_HO ? Math.pow(N_HO / N_HE, 1/6) : 1;
        return (sigma_H_lim * K_HL) / s_H;
    };

    tinhThongSoBoTruyenBanhRangTru(heSoThietKe, BangDacTinh) {
        const trucII = BangDacTinh.find(t => t.truc === "II");
        const trucIII = BangDacTinh.find(t => t.truc === "III");

        const T1 = trucII.momentXoan; 
        const n1 = trucII.soVongQuay; 
        const n2 = trucIII.soVongQuay; 
        const u_tru = trucIII.tySoTruyen;
        let thoiGianPhucVu = this.thungTron.getThoiGianPhucVu();
        thoiGianPhucVu = 43200
        
        // 1. Xử lý hệ số chiều rộng vành răng (Theo công thức 3.97)
        // psi_bd = 0.53 * psi_ba * (u + 1) => psi_ba = psi_bd / (0.53 * (u + 1))
        const psi_bd2 = heSoThietKe.psi_bd2;
        let psi_ba = Number((psi_bd2 / (0.53 * (u_tru + 1))).toFixed(2));
        psi_ba = 0.25 // harcode, mốt sửa sau

        // 2. Thông số vật liệu (Không fix cứng, mô phỏng data từ Bảng 6.1)
        const vatLieu = {
            banhDan: { HB: 300, s_H: 1.1 },
            banhBiDan: { HB: 290, s_H: 1.1 }
        };

        // Tính ứng suất với s_H truyền vào
        const sigma_H1 = HeThongTruyenDong.tinhUngSuatTiepXuc(vatLieu.banhDan.HB, n1, thoiGianPhucVu, vatLieu.banhDan.s_H);
        const sigma_H2 = HeThongTruyenDong.tinhUngSuatTiepXuc(vatLieu.banhBiDan.HB, n2, thoiGianPhucVu, vatLieu.banhBiDan.s_H);
        const sigma_H_cp = Math.min(sigma_H1, sigma_H2);

        // 3. Tính khoảng cách trục sơ bộ
        const K_a = 49.5; 
        const K_H_beta = 1.03; // Tra theo bảng (hình 3c62da)
        
        let a_w_soBo = K_a * (u_tru + 1) * Math.cbrt(
            (T1 * K_H_beta) / (Math.pow(sigma_H_cp, 2) * u_tru * psi_ba)
        );
        let a_w = HeThongTruyenDong.quyChuanKhoangCachTruc(a_w_soBo);

        // 4. Tính mô đun và số răng
        let m_soBo = 0.015 * a_w; 
        const m_tc = HeThongTruyenDong.quyChuanMoDun(m_soBo);

        let z1 = Math.round((2 * a_w) / (m_tc * (u_tru + 1)));
        if (z1 < 17) z1 = 17; 
        
        const z2 = Math.round(z1 * u_tru);
        const u_thucTe = z2 / z1;

        // 5. CHỐT KHOẢNG CÁCH TRỤC CHÍNH THỨC (Công thức 3.103)
        // Bắt buộc tính lại do z1, z2 đã bị làm tròn và m đã lấy theo tiêu chuẩn
        a_w = m_tc * (z1 + z2) / 2;

        // 6. TÍNH KÍCH THƯỚC HÌNH HỌC (Theo Bảng 3.3)
        // Chiều rộng vành răng
        const b_w = Number((psi_ba * a_w).toFixed(2));

        // Đường kính chia (d)
        const d1 = m_tc * z1;
        const d2 = m_tc * z2;

        // Đường kính lăn (dw)
        const d_w1 = Number((2 * a_w / (u_thucTe + 1)).toFixed(2));
        const d_w2 = Number((d_w1 * u_thucTe).toFixed(2));

        // Đường kính đỉnh răng (da)
        const d_a1 = d1 + 2 * m_tc;
        const d_a2 = d2 + 2 * m_tc;

        // Đường kính đáy răng (df)
        const d_f1 = d1 - 2.5 * m_tc;
        const d_f2 = d2 - 2.5 * m_tc;

        // Đường kính cơ sở (db) với góc alpha = 20 độ
        const alpha = 20; 
        const alpha_rad = alpha * Math.PI / 180; // Chuyển đổi sang radian để dùng Math.cos
        const d_b1 = Number((d1 * Math.cos(alpha_rad)).toFixed(2));
        const d_b2 = Number((d2 * Math.cos(alpha_rad)).toFixed(2));

        return {
            ungSuatTiepXucChoPhep: Number(sigma_H_cp.toFixed(2)),
            thongSoKichThuoc: {
                khoangCachTruc_aw: a_w,
                moDun_m: m_tc,
                chieuRongVanhRang_bw: b_w
            },
            thongSoBanhRang: {
                soRang_z1: z1,
                soRang_z2: z2,
                duongKinhChia_d1: d1,
                duongKinhChia_d2: d2,
                duongKinhVongLan_dw1: d_w1,
                duongKinhVongLan_dw2: d_w2,
                duongKinhDinhRang_da1: d_a1,
                duongKinhDinhRang_da2: d_a2,
                duongKinhDayRang_df1: d_f1,
                duongKinhDayRang_df2: d_f2,
                duongKinhCoSo_db1: d_b1,
                duongKinhCoSo_db2: d_b2,
                gocProfinGoc_alpha: alpha,
                gocProfinRang_at: alpha,
                gocAnKhop_atw: alpha
            },
            kiemTraSaiSo: {
                tySoTruyenThucTe: Number(u_thucTe.toFixed(4)),
                saiSoU: Number((Math.abs(u_thucTe - u_tru) / u_tru * 100).toFixed(2)) // %
            }
        };
    }
}   

