export class CapBanhRangCon {
    /*
    soRang: Số răng của bánh dẫn và bánh bị dẫn (z1, z2)
    modul: Mô đun vòng trung bình (mm)
    gocCon: Góc mặt nón chia (Độ)
    lucVong: Lực vòng (N)
    lucHuongTam: Lực hướng tâm (N)
    lucDocTruc: Lực dọc trục (N)
    kiemNghiemBenTiepXuc: Trạng thái hoặc giá trị ứng suất tiếp xúc (MPa / Boolean)
    kiemNghiemBenUon: Trạng thái hoặc giá trị ứng suất uốn (MPa / Boolean)
    */
    constructor(soRang, modul, gocCon, lucVong, lucHuongTam, lucDocTruc, kiemNghiemBenTiepXuc, kiemNghiemBenUon) {
        this.soRang = soRang 
        this.modul = modul 
        this.gocCon = gocCon 
        this.lucVong = lucVong 
        this.lucHuongTam = lucHuongTam 
        this.lucDocTruc = lucDocTruc 
        this.kiemNghiemBenTiepXuc = kiemNghiemBenTiepXuc 
        this.kiemNghiemBenUon= kiemNghiemBenUon
    }
}