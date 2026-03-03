export class Truc {
    /*
    congSuat: Công suất truyền trên trục (kW) 
    vongQuay: Số vòng quay của trục (Vòng/phút)
    momenXoan: Mô men xoắn trên trục (N.mm)
    duongKinh: Đường kính tại các đoạn trục (mm) - Thường là Object hoặc Array chứa d1, d2, d3...
    vatLieu: Vật liệu chế tạo trục (VD: Thép 45, hoặc một Object chứa Giới hạn bền, Giới hạn chảy)
    kiemNghiemBen: Kết quả kiểm tra hệ số an toàn về độ bền mỏi và tĩnh (Object hoặc Boolean)
    */
    constructor(congSuat, vongQuay, momenXoan, duongKinh, vatLieu, kiemNghiemBen) {
        this.congSuat = congSuat;
        this.vongQuay = vongQuay;
        this.momenXoan = momenXoan;
        this.duongKinh = duongKinh;
        this.vatLieu = vatLieu;
        this.kiemNghiemBen = kiemNghiemBen;
    }
}