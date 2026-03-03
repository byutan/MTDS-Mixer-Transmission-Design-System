export class BoTruyenDai {
    /*
    d1: Đường kính bánh đai nhỏ (mm)
    d2: Đường kính bánh đai lớn (mm)
    khoangCachTruc: Khoảng cách giữa 2 tâm trục(mm)
    chieuDaiDai: Chiều dài dây đai (mm)
    vanTocDai: Vận tốc vòng của đai (m/s)
    gocOm: Góc ôm trên bánh đai nhỏ (Độ)
    soDai: Số lượng dây đai cần thiết (Đai)
    lucTacDungTruc: Lực do đai tác dụng lên trục (N)
    ungSuat: Ứng suất lớn nhất trong dây đai (MPa)
    tuoiTho: Tuổi thọ của đai (h)
    */
    constructor(d1, d2, khoangCachTruc, chieuDaiDai, vanTocDai, gocOm, soDai, lucTacDungTruc, ungSuat, tuoiTho) {
        this.d1 = d1;
        this.d2 = d2;
        this.khoangCachTruc = khoangCachTruc;
        this.chieuDaiDai = chieuDaiDai;
        this.vanTocDai = vanTocDai;
        this.gocOm = gocOm;
        this.soDai = soDai;
        this.lucTacDungTruc = lucTacDungTruc;
        this.ungSuat = ungSuat;
        this.tuoiTho = tuoiTho;
    }   
}