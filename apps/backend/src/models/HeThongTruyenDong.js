import {HopGiamToc} from './HopGiamToc.js'
import {DongCo} from './DongCo.js'
import {BoTruyenDai} from './BoTruyenDai.js'
import {TySoTruyen} from './TySoTruyen.js'

export class HeThongTruyenDong {
    /*
    dongCo: Đối tượng Động cơ
    boTruyenDai: Đối tượng Bộ truyền đai 
    hopGiamToc: Đối tượng Hộp giảm tốc 
    danhSachTruc: Mảng chứa các đối tượng Trục 
    danhSachOLan: Mảng chứa các đối tượng Ổ lăn 
    tySoTruyen: Bộ Tỷ số truyền của toàn hệ thống
    hieuSuatTungCap: Mảng chứa hiệu suất các bộ truyền và ổ lăn 
    */
    constructor(dongCo, boTruyenDai, hopGiamToc, danhSachTruc, danhSachOLan, tySoTruyen, hieuSuatTungCap) {
        if (dongCo instanceof DongCo 
        && boTruyenDai instanceof BoTruyenDai
        && hopGiamToc instanceof HopGiamToc
        && tySoTruyen instanceof TySoTruyen) { 
            this.dongCo = dongCo;
            this.boTruyenDai = boTruyenDai;
            this.hopGiamToc = hopGiamToc;
            this.danhSachTruc = danhSachTruc || [];
            this.danhSachOLan = danhSachOLan || [];
            this.tySoTruyen = tySoTruyen;
            this.hieuSuatTungCap = hieuSuatTungCap;
        }
    }
}