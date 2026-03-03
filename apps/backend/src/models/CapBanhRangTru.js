export class CapBanhRangTru {
    /*
    modul: Mô đun của bánh răng (mm)
    soRang: Số răng của bánh dẫn và bánh bị dẫn (z1, z2)
    khoangCachTruc: Khoảng cách giữa 2 tâm trục (mm)
    luc: Các thành phần lực tác dụng (Lực vòng, lực hướng tâm, lực dọc trục nếu là răng nghiêng) (N)
    kiemNghiemUon: Trạng thái hoặc giá trị ứng suất uốn (MPa / Boolean)
    */
    constructor(modul, soRang, khoangCachTruc, luc, kiemNghiemUon) {
        this.modul = modul 
        this.soRang = soRang 
        this.khoangCachTruc = khoangCachTruc 
        this.luc = luc 
        this.kiemNghiemUon= kiemNghiemUon
    }
}