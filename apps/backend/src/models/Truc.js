import {trabangvatLieu, traVatLieuTheoDieuKien} from "../utils/Bangvatlieu.js";
import {traBangKichThuocThen} from "../utils/Bang_9_1.js"
import {traHeSoAnhHuongUngSuatTrungBinh} from "../utils/Bang_10_7.js"
import {traKx} from "../utils/Bang_10_8.js"
import {traKy} from "../utils/Bang_10_9.js"
import {traEpsilonSigma, traEpsilonTau} from "../utils/Bang_10_10.js" 
export class Truc {
    #tenTruc
    #congSuat
    #tySoTruyen
    #soVongQuay
    #momentXoan
    #nhanhieuthep
    #nhietluyen
    #Thongtintruc
    /**
     * @param {{ 
     * tenTruc: string, 
     * congSuat: number, 
     * tySoTruyen: number | null, 
     * soVongQuay: number, 
     * momentXoan: number 
     * nhanhieuthep: string,
     * nhietluyen: string,
     * Thongtintruc: object
     * }} params
     */
    constructor({ tenTruc, congSuat, tySoTruyen, soVongQuay, momentXoan, nhanhieuthep, nhietluyen, Thongtintruc}) {
        this.#tenTruc = tenTruc;
        this.#congSuat = congSuat;
        this.#tySoTruyen = tySoTruyen; 
        this.#soVongQuay = soVongQuay; 
        this.#momentXoan = momentXoan; 
        this.#nhanhieuthep = nhanhieuthep;
        this.#nhietluyen = nhietluyen;
        this.#Thongtintruc = Thongtintruc || {};
    }
    getTenTruc() {
        return this.#tenTruc
    }
    getCongSuat() {
        return this.#congSuat
    }
    getTySoTruyen() {
        return this.#tySoTruyen
    }
    getSoVongQuay() {
        return this.#soVongQuay
    }
    getMomentXoan() {
        return this.#momentXoan
    }
    getNhanhieuthep(){
        return this.#nhanhieuthep
    }
    getNhietluyen(){
        return this.#nhietluyen
    }
    getDKinhTieuChuan(){
        return this.#Thongtintruc
    }
    /**
     * Lấy đường kính tiêu chuẩn cho một tiết diện cụ thể của một trục
     * @param {string} tenTruc - Tên trục (I, II, hoặc III)
     * @param {string} tenTietDien - Tên tiết diện
     * @returns {number} - Đường kính tiêu chuẩn
     */
    getDiameterForSection(tenTruc, tenTietDien) {
        const trucKey = `truc${tenTruc}`;
        const sectionDiameters = this.#Thongtintruc[trucKey];
        if (!sectionDiameters || sectionDiameters[tenTietDien] === undefined) {
            throw new Error(`Không tìm thấy đường kính tiêu chuẩn cho trục ${tenTruc}, tiết diện ${tenTietDien}`);
        }
        return sectionDiameters[tenTietDien];
    }
 
    //--------------------------------Momen tương đương----------------------------------
    /**
     * Mtd là Momen tương đương
     * Mx, My là momen uốn theo 2 mặt phẳng (N.mm)
     * T là momen xoắn (N.mm)
     * ở đây Mx và My lần lượt là Bx và By
     * công thức trang 63 bảng 4.3
     */
    tinh_Mtd(Mx, My, T) {
        const trong_can = Math.pow(Mx, 2) + Math.pow(My, 2)+ (3/4)*Math.pow(T, 2)
        return Math.sqrt(trong_can)
    }
    /**
     * dtd là đường kính theo momen tương đương (mm)
     * Mtd là momen tương đương (N.mm)
     * t là ứng suất xoắn cho phép (Mpa=N/mm2)
     * công thức trang 63 bảng 4.3
     */
    tinh_DuongKinhTheoUngSuat(Mtd, t = 60) {
        return Math.cbrt(Mtd / (0.1 * t))
    }

    tinh_DuongKinhTang11(d) {
        return Number((d * 1.11))
    }
    Tinh_D_Tai_TietDien(Ten_tietdien,T,Mx, My, t, co_then, dtc){
        const momenxoan = T
        const Mtd = this.tinh_Mtd(Mx, My, T)
        const dtd = this.tinh_DuongKinhTheoUngSuat(Mtd, t)
        let d_tang_11 = null
        const dtieuchuan = dtc
        if (co_then==true){
          d_tang_11 = this.tinh_DuongKinhTang11(dtd)
        return {
            "Tietdientai": Ten_tietdien,
            "Momenxoan": momenxoan,
            "Momentd": Number((Mtd || 0).toFixed(2)),
            "Trisosuatchophep": t,
            "Dtuongduong": Number((dtd || 0).toFixed(2)),
            "Dtang11": Number((d_tang_11 || 0).toFixed(2)),
            "Dtieuchuan": dtieuchuan
            }
        }
        else {
            d_tang_11 = '-'
         return {
            "Tietdientai": Ten_tietdien,
            "Momenxoan": momenxoan,
            "Momentd": Number((Mtd || 0).toFixed(2)),
            "Trisosuatchophep": t,
            "Dtuongduong": Number((dtd || 0).toFixed(2)),
            "Dtang11": d_tang_11,
            "Dtieuchuan": dtieuchuan
            }
        }
    }
//------------------------------Bảng 4.3: Xác định đường kính trục theo momen tương đương-------------------------------
    tinhBangDuongKinhTheoMomenTuongDuong_trucI() {
        const T = this.#momentXoan; 
        const ten_truc = this.#tenTruc
        const t = 60
        // tại bánh đai thang lớn
        const ten_tietdien1 = "Bánh đai thang lớn"
        const Mx_daithang = 0
        const My_daithang = 0
        const cothen_daithang = true
        const dtc_daithang = this.getDiameterForSection("I", ten_tietdien1)
        
        const ketqua_daithang = this.Tinh_D_Tai_TietDien(ten_tietdien1, T, Mx_daithang, My_daithang, t, cothen_daithang, dtc_daithang)
        // tại A
        const ten_tietdien2 = "A"
        const Mx_A = 49390.85
        const My_A = 169012.6
        const cothen_A = false
        const dtc_A = this.getDiameterForSection("I", ten_tietdien2)
        const ketqua_A = this.Tinh_D_Tai_TietDien(ten_tietdien2, T, Mx_A, My_A, t, cothen_A, dtc_A)
        // tại B
        const ten_tietdien3 = "B"
        const Mx_B = 57901.2
        const My_B = 0
        const cothen_B = false
        const dtc_B = this.getDiameterForSection("I", ten_tietdien3)
        const ketqua_B = this.Tinh_D_Tai_TietDien(ten_tietdien3, T, Mx_B, My_B, t, cothen_B, dtc_B)
        // tại bánh răng côn nhỏ
         const ten_tietdien4 = "Bánh răng côn nhỏ"
        const Mx_connho = 9238.35
        const My_connho = 0
        const cothen_connho = true
        const dtc_connho = this.getDiameterForSection("I", ten_tietdien4)
        const ketqua_connho = this.Tinh_D_Tai_TietDien(ten_tietdien4, T, Mx_connho, My_connho, t, cothen_connho, dtc_connho)
        return {
            ten_truc,
            ketqua_daithang,
            ketqua_A,
            ketqua_B,
            ketqua_connho
        };
    }
//------------------------------Bảng 4.12: Xác định đường kính trục theo momen tương đương-------------------------------
    tinhBangDuongKinhTheoMomenTuongDuong_trucII() {
        const T = this.#momentXoan; 
        const ten_truc = this.#tenTruc
        const t = 56
        // tại C
        const ten_tietdien1 = "C"
        const Mx_c = 0
        const My_c = 0
        const cothen_c = false
        const dtc_c = this.getDiameterForSection("II", ten_tietdien1)
        const ketqua_c = this.Tinh_D_Tai_TietDien(ten_tietdien1, 0, Mx_c, My_c, t, cothen_c, dtc_c)
        // tại Bánh răng trụ nhỏ
        const ten_tietdien2 = "Bánh răng trụ nhỏ"
        const Mx_Banhrangtrunho = 104837.10
        const My_Banhrangtrunho = 248803.49
        const cothen_Banhrangtrunho = true
        const dtc_Banhrangtrunho = this.getDiameterForSection("II", ten_tietdien2)
        const ketqua_Banhrangtrunho = this.Tinh_D_Tai_TietDien(ten_tietdien2, T, Mx_Banhrangtrunho, My_Banhrangtrunho, t, cothen_Banhrangtrunho, dtc_Banhrangtrunho)
        // tại Bánh răng côn lớn
        const ten_tietdien3 = "Bánh răng côn lớn"
        const Mx_Banhrangconlon = 91879.78
        const My_Banhrangconlon = 226314.5
        const cothen_Banhrangconlon = true
        const dtc_Banhrangconlon = this.getDiameterForSection("II", ten_tietdien3)
        const ketqua_Banhrangconlon = this.Tinh_D_Tai_TietDien(ten_tietdien3, T, Mx_Banhrangconlon, My_Banhrangconlon, t, cothen_Banhrangconlon, dtc_Banhrangconlon)
        // tại D
         const ten_tietdien4 = "D"
        const Mx_D = 0
        const My_D = 0
        const cothen_D = false
        const dtc_D = this.getDiameterForSection("II", ten_tietdien4)
        const ketqua_D = this.Tinh_D_Tai_TietDien(ten_tietdien4, 0, Mx_D, My_D, t, cothen_D, dtc_D)
        return {
            ten_truc,
            ketqua_c,
            ketqua_Banhrangtrunho,
            ketqua_Banhrangconlon,
            ketqua_D
        };
    }
//------------------------------Bảng 4.21: Xác định đường kính trục theo momen tương đương-------------------------------
   tinhBangDuongKinhTheoMomenTuongDuong_trucIII() {
        const T = this.#momentXoan; 
        const ten_truc = this.#tenTruc
        const t = 50
        // tại E
        const ten_tietdien1 = "E"
        const Mx_E = 0
        const My_E = 0
        const cothen_E = false
        const dtc_E = this.getDiameterForSection("III", ten_tietdien1)
        const ketqua_E = this.Tinh_D_Tai_TietDien(ten_tietdien1, 0, Mx_E, My_E, t, cothen_E, dtc_E)
        // tại Bánh răng trụ lớn
        const ten_tietdien2 = "Bánh răng trụ lớn"
        const Mx_Banhrangtrulon = 81089.03
        const My_Banhrangtrulon = 368303.87
        const cothen_Banhrangtrulon = true
        const dtc_Banhrangtrulon = this.getDiameterForSection("III", ten_tietdien2)
        const ketqua_Banhrangtrulon = this.Tinh_D_Tai_TietDien(ten_tietdien2, T, Mx_Banhrangtrulon, My_Banhrangtrulon, t, cothen_Banhrangtrulon, dtc_Banhrangtrulon)
        // tại F
        const ten_tietdien3 = "F"
        const Mx_F = 0
        const My_F = 433125
        const cothen_F = false
        const dtc_F = this.getDiameterForSection("III", ten_tietdien3)
        const ketqua_F = this.Tinh_D_Tai_TietDien(ten_tietdien3, T, Mx_F, My_F, t, cothen_F, dtc_F)
        // tại Khớp nối
         const ten_tietdien4 = "Khớp nối"
        const Mx_Khopnoi = 0
        const My_Khopnoi = 0
        const cothen_Khopnoi = true
        const dtc_Khopnoi = this.getDiameterForSection("III", ten_tietdien4)
        const ketqua_Khopnoi = this.Tinh_D_Tai_TietDien(ten_tietdien4, T, Mx_Khopnoi, My_Khopnoi, t, cothen_Khopnoi, dtc_Khopnoi)
        return {
            ten_truc,
            ketqua_E,
            ketqua_Banhrangtrulon,
            ketqua_F,
            ketqua_Khopnoi
        };
    }
   tinhBangDuongKinhTheoMomenTuongDuong() {
        switch (this.getTenTruc()) {
            case "I":
                return this.tinhBangDuongKinhTheoMomenTuongDuong_trucI()
            case "II":
                return this.tinhBangDuongKinhTheoMomenTuongDuong_trucII()
            case "III":
                return this.tinhBangDuongKinhTheoMomenTuongDuong_trucIII()
            default:
                throw new Error("Loại trục không hợp lệ!")
        }
    }
//--------------------------------Kiểm nghiệm độ bền mỏi----------------------------------
    /**
     * công thức 4.14 trang 64
     */
    Tinh_biendoungsuatphap(Mj, Wj){
        if(Mj != 0 && Wj != 0){
            const g_aj = Mj/Wj
            return g_aj
        }
        else return '-'
    }
    /**
     * công thức 4.15 trang 64
     */
    Tinh_momentuongtong(Mxj,Myj){
        const trong_can = Math.pow(Mxj,2) + Math.pow(Myj,2)
        const Mj = Math.sqrt(trong_can)
        return Mj
    }
    /**
     * công thức 4.16 trang 65
     */
    Tinh_momentchonguon(b, t1, dj, tj){
        const part_1 = (Math.PI * Math.pow(dj,3)) / 32
        const tu = b*t1*Math.pow((dj-tj),2)
        const mau = 2*dj
        const part_2= tu/mau
        const W_j = part_1 - part_2
        return W_j
    }
    /**
     * công thức 4.17 trang 65
     */
    Tinh_Taj(Woj,T){
        if (Woj != 0 && T !=0){
            const T_aj = T / (2*Woj)
            return T_aj
        }
        else return '-'
    }
    /**
     * công thức 4.18 trang 65
     */
    Tinh_Woj(b, t1, dj, tj){
         const part_1 = (Math.PI * Math.pow(dj,3)) / 16
        const tu = b*t1*Math.pow((dj-tj),2)
        const mau = 2*dj
        const part_2= tu/mau
        const Woj = part_1 - part_2
        return Woj
    }
    /**
     * công thức 4.19 trang 65
     */
    Tinh_heso_Kgdj(Kg, eg, Kx, Ky){
        const tu = (Kg/eg) + Kx - 1
        const K_gdj = tu / Ky
        return K_gdj
    }
    /**
     * công thức 4.20 trang 64
     */
    Tinh_heso_Ktdj(Kt, et, Kx, Ky){
        const tu = (Kt/et) + Kx -1
        const K_tdj = tu / Ky
        return K_tdj
    }
     /**
     * công thức 4.10 trang 64
     */
    Tinh_hesoantoanuon(g_1, K_gdj, g_aj, W_g, g_mj){
        const mau = K_gdj * g_aj + W_g * g_mj
        const S_gj = g_1 / mau
        return S_gj
    }
    /**
     * công thức 4.11 trang 64
     */
    Tinh_hesoantoanxoan(T_1, K_tdj, T_aj, W_t, T_mj){
        const mau = K_tdj * T_aj + W_t * T_mj
        const S_tj = T_1/ mau
        return S_tj
    }
    /**
     * công thức trang 63 4.9
     */
    Tinh_HSAT(S_gj, S_tj){
        const tu = S_gj * S_tj
        const mau = Math.sqrt(Math.pow(S_gj, 2) + Math.pow(S_tj, 2))
        const Sj = tu/mau
        return Sj
    }
    
//=================================================================================================================
    Tinh_bang_4_5_taimoitietdien(Tietdien,Mx,My,cothen,d,T){
        const result = traBangKichThuocThen(d,"9.1a")
        let b,t1
        if (cothen==false) {
            b = 0
            t1= 0
        }
        else { ({b,t1} = result)}
        const Wj = this.Tinh_momentchonguon(b,t1,d,t1)
        const Woj = this.Tinh_Woj(b,t1,d,t1)
        const Mj = this.Tinh_momentuongtong(Mx,My)
        const Tj = T
        const g_aj = this.Tinh_biendoungsuatphap(Mj,Wj)
        const T_aj = this.Tinh_Taj(Woj,T)
        if (g_aj != '-'&& T_aj != '-'){
            return{
                "Tietdientai": Tietdien,
                "Wj": Number((Wj || 0).toFixed(2)) ,
                "Woj": Number((Woj || 0).toFixed(2)),
                "Mj": Number((Mj || 0).toFixed(2)),
                "Tj": Number((Tj || 0).toFixed(2)),
                "g_aj": Number((g_aj || 0).toFixed(2)),
                "T_aj": Number((T_aj || 0).toFixed(2))
            }
        }
        else {
            return{
            "Tietdientai": Tietdien,
            "Wj": Number((Wj || 0).toFixed(2)) ,
            "Woj": Number((Woj || 0).toFixed(2)),
            "Mj": Number((Mj || 0).toFixed(2)),
            "Tj": Number((Tj || 0).toFixed(2)),
            "g_aj": g_aj,
            "T_aj": T_aj
            }
        }
    }
    /**
     * BẢNG 4.5: Kiểm nghiệm độ bền mỏi của Trục I
     * Tính toán W_j, W_oj, M_j, T_j, sigma_aj, tau_aj cho 3 tiết diện
     */
    kiemnghiemdobentrucI() {
        //tiết diện bánh đai thang lớn
        const result = this.tinhBangDuongKinhTheoMomenTuongDuong()
        const tietdien1 = result.ketqua_daithang
        let cothen 
        if (tietdien1.Dtang11!='-') cothen = true 
        else cothen = false
        const result_tietdien1 = this.Tinh_bang_4_5_taimoitietdien(tietdien1.Tietdientai, 0, 0, cothen, tietdien1.Dtieuchuan, this.getMomentXoan())
        // tiết diện ổ lăn
        const tietdien2 = result.ketqua_A
        if (tietdien2.Dtang11!='-') cothen = true 
        else cothen = false
        const result_tietdien2 = this.Tinh_bang_4_5_taimoitietdien("ổ lăn", 49390.85, 169012.6, cothen, tietdien2.Dtieuchuan, this.getMomentXoan())
        // tiết diện bánh răng côn nhỏ
        const tietdien3 = result.ketqua_connho
          if (tietdien3.Dtang11!='-') cothen = true 
        else cothen = false
        const result_tietdien3 = this.Tinh_bang_4_5_taimoitietdien(tietdien3.Tietdientai, 9238.5, 0, cothen,tietdien3.Dtieuchuan, this.getMomentXoan())
        return{
            "TenTruc": this.getTenTruc(),
            result_tietdien1,
            result_tietdien2,
            result_tietdien3
        }
    }
    kiemnghiemdobentrucII() {
        //tiết diện bánh răng trụ nhỏ
        const result = this.tinhBangDuongKinhTheoMomenTuongDuong()
        const tietdien1 = result.ketqua_Banhrangtrunho
        let cothen 
        if (tietdien1.Dtang11!='-') cothen = true 
        else cothen = false
        const result_tietdien1 = this.Tinh_bang_4_5_taimoitietdien(tietdien1.Tietdientai, 104837.10, 248803.49, cothen, tietdien1.Dtieuchuan, this.getMomentXoan())
        // tiết diện ổ lăn
        const tietdien2 = result.ketqua_c
        if (tietdien2.Dtang11!='-') cothen = true 
        else cothen = false
        const result_tietdien2 = this.Tinh_bang_4_5_taimoitietdien("ổ lăn", 0, 0, cothen, tietdien2.Dtieuchuan, 0)
        // tiết diện bánh răng côn lớn
        const tietdien3 = result.ketqua_Banhrangconlon
          if (tietdien3.Dtang11!='-') cothen = true 
        else cothen = false
        const result_tietdien3 = this.Tinh_bang_4_5_taimoitietdien(tietdien3.Tietdientai, 91879.78, 226314.5, cothen,tietdien3.Dtieuchuan, this.getMomentXoan())
        return{
            "TenTruc": this.getTenTruc(),
            result_tietdien1,
            result_tietdien2,
            result_tietdien3
        }
    }
    kiemnghiemdobentrucIII() {
        //tiết diện bánh răng trụ lớn
        const result = this.tinhBangDuongKinhTheoMomenTuongDuong()
        const tietdien1 = result.ketqua_Banhrangtrulon
        let cothen 
        if (tietdien1.Dtang11!='-') cothen = true 
        else cothen = false
        const result_tietdien1 = this.Tinh_bang_4_5_taimoitietdien(tietdien1.Tietdientai, 81089.03, 368303.87, cothen, tietdien1.Dtieuchuan, this.getMomentXoan())
        // tiết diện ổ lăn
        const tietdien2 = result.ketqua_F
        if (tietdien2.Dtang11!='-') cothen = true 
        else cothen = false
        const result_tietdien2 = this.Tinh_bang_4_5_taimoitietdien("ổ lăn", 0, 433125, cothen, tietdien2.Dtieuchuan, this.getMomentXoan())
        // tiết diện khớp nối
        const tietdien3 = result.ketqua_Khopnoi
          if (tietdien3.Dtang11!='-') cothen = true 
        else cothen = false
        const result_tietdien3 = this.Tinh_bang_4_5_taimoitietdien(tietdien3.Tietdientai, 0, 0, cothen,tietdien3.Dtieuchuan, this.getMomentXoan())
        return{
            "TenTruc": this.getTenTruc(),
            result_tietdien1,
            result_tietdien2,
            result_tietdien3
        }
    }
    Kiemnghiemdobentruc() {
            switch (this.getTenTruc()) {
                case "I":
                    return this.kiemnghiemdobentrucI()
                case "II":
                    return this.kiemnghiemdobentrucII()
                case "III":
                    return this.kiemnghiemdobentrucIII()
                default:
                    throw new Error("Loại trục không hợp lệ!")
            }
        }
//============================================================================================================================
// Bảng 4.6 - Kiểm nghiệm hệ số an toàn mỏi
    layThongTinVatLieu() {
        const vatlieu = trabangvatLieu(this.getNhanhieuthep(), this.getNhietluyen());
        if (!vatlieu) {
            throw new Error(`Không tìm thấy vật liệu với nhanhieuthep=${this.getNhanhieuthep()}, nhietluyen=${this.getNhietluyen()}`);
        }
        return vatlieu;
    }
    tinhGioiHanMoi( sigmaB) {
        const sigma_minus_1 = 0.436 *  sigmaB;
        const tau_minus_1 = 0.58 * sigma_minus_1;
        return { sigma_minus_1, tau_minus_1 };
    }
    tinhHesoAnhHuongUngSuatTrungBinh(sigmaB) {
        const ketQua = traHeSoAnhHuongUngSuatTrungBinh(sigmaB);
        return { W_g: ketQua.W_g, W_t: ketQua.W_t };
    }

    tinhBang_4_6_TaiTietDien(tenTietDien,Mx, My, dtc,coThen,T,phuongPhapGiaCong,phuongPhapTangBen) {
        // Lấy vật liệu
        const vatlieu = this.layThongTinVatLieu();
        // 1. Tính epsilon (εσ, ετ) - Hệ số chế độ bề mặt (từ bảng 10.10)
        const epsilonSigma = traEpsilonSigma(dtc, "thep_carbon");
        const epsilonTau = traEpsilonTau(dtc);

        // 2. Tính Kσ, Kτ (Hệ số tập trung ứng suất từ bảng 10.8 và 10.9)
        let Kx, Ky;
        try {
            Kx = traKx(phuongPhapGiaCong, vatlieu.gioihanben);
        } catch (e) {
            Kx = 1.95; // Giá trị mặc định nếu không tìm thấy
        }

        try {
            Ky = traKy({
                phuongPhapTangBenBeMat: phuongPhapTangBen,
                sigmaBLoi: vatlieu.gioihanben,
                nhomTruc: "trucNhan",
                cachChon: "min"
            });
        } catch (e) {
            Ky = 1.8; // Giá trị mặc định nếu không tìm thấy
        }

        // 3. Tính Kσdj, Kτdj (Hệ số kích thước bề mặt)
        const { W_g, W_t } = this.tinhHesoAnhHuongUngSuatTrungBinh( vatlieu.gioihanben);
        const heSoKx = 1;
        const heSoKy = 1.35;
        const Kx_dj = this.Tinh_heso_Kgdj(Kx, epsilonSigma, heSoKx, heSoKy);
        const Ky_dj = this.Tinh_heso_Ktdj(Ky, epsilonTau, heSoKx, heSoKy);

        // 4. Tính giới hạn mỏi
        const { sigma_minus_1, tau_minus_1 } = this.tinhGioiHanMoi( vatlieu.gioihanben);

        // 5. Tính Wj và Woj (Moment chống uốn và xoắn)
        let b = 0, t1 = 0;
        if (coThen) {
            const then = traBangKichThuocThen(dtc, "9.1a");
            b = then.b;
            t1 = then.t1;
        }

        const Wj = this.Tinh_momentchonguon(b, t1, dtc, t1);
        const Woj = this.Tinh_Woj(b, t1, dtc, t1);

        // 6. Tính Mj (Moment uốn tổng)
        const Mj = this.Tinh_momentuongtong(Mx, My);

        // 7. Tính ứng suất thay đổi
        const sigma_aj = this.Tinh_biendoungsuatphap(Mj, Wj);
        const tau_aj = this.Tinh_Taj(Woj, T);

        // 8. Tính hệ số an toàn
        let sigma_j_safety = "-";
        let tau_j_safety = "-";
        let combined_safety = "-";

        if (sigma_aj !== "-" && tau_aj !== "-") {
            sigma_j_safety = Number((this.Tinh_hesoantoanuon(sigma_minus_1, Kx_dj, sigma_aj, W_g, sigma_minus_1 || 0) || 0).toFixed(2));
            tau_j_safety = Number((this.Tinh_hesoantoanxoan(tau_minus_1, Ky_dj, tau_aj, W_t, tau_minus_1 || 0) || 0).toFixed(2));
            combined_safety = this.Tinh_HSAT(sigma_j_safety, tau_j_safety);
            combined_safety = Number((combined_safety || 0).toFixed(2));
        } else if (sigma_aj !== "-") {
            sigma_j_safety = Number((this.Tinh_hesoantoanuon(sigma_minus_1, Kx_dj, sigma_aj, W_g, sigma_minus_1 || 0) || 0).toFixed(2));
        } else if (tau_aj !== "-") {
            tau_j_safety = Number((this.Tinh_hesoantoanxoan(tau_minus_1, Ky_dj, tau_aj, W_t, tau_minus_1 || 0) || 0).toFixed(2));
        }

        return {
            "Tietdientai": tenTietDien,
            "εσ": Number((epsilonSigma || 0).toFixed(3)),
            "ετ": Number((epsilonTau || 0).toFixed(3)),
            "Kσ": Kx,
            "Kτ": Ky,
            "Kσdj": Number((Kx_dj || 0).toFixed(2)),
            "Kτdj": Number((Ky_dj || 0).toFixed(2)),
            "sσj": sigma_j_safety,
            "sτj": tau_j_safety,
            "s": combined_safety
        };
    }
    /**
     * Kiểm nghiệm hệ số an toàn mỏi cho Trục I
     * Bảng 4.6: Kiểm nghiệm độ bền mỏi
     */
    kiemnghiemHesoAnToaTrucI() {
        const T = this.#momentXoan;
        const ten_truc = this.#tenTruc;
        const result = this.tinhBangDuongKinhTheoMomenTuongDuong()
        // Tiết diện bánh đai thang lớn
        const tietdien1 = result.ketqua_daithang
        let cothen 
        if (tietdien1.Dtang11!='-') cothen = true 
        else cothen = false
        const ketqua_tietdien1 = this.tinhBang_4_6_TaiTietDien(tietdien1.Tietdientai, 0, 0, tietdien1.Dtieuchuan, cothen, this.getMomentXoan());
        // Tiết diện Ổ lăn (điểm A)
        const tietdien2 = result.ketqua_A
        if (tietdien2.Dtang11!='-') cothen = true 
        else cothen = false
        const ketqua_tietdien2 = this.tinhBang_4_6_TaiTietDien("ổ lăn", 49390.85, 169012.6, tietdien2.Dtieuchuan, cothen, this.getMomentXoan());
        // Tiết diện bánh răng côn nhỏ
        const tietdien3 = result.ketqua_connho
        if (tietdien3.Dtang11!='-') cothen = true 
        else cothen = false
        const ketqua_tietdien3 = this.tinhBang_4_6_TaiTietDien(tietdien3.Tietdientai, 9238.5, 0, tietdien3.Dtieuchuan, cothen, this.getMomentXoan());
        return {
            "ten_truc": ten_truc,
            ketqua_tietdien1,
            ketqua_tietdien2,
            ketqua_tietdien3
        };
    }

    /**
     * Kiểm nghiệm hệ số an toàn mỏi cho Trục II
     * Bảng 4.6: Kiểm nghiệm độ bền mỏi
     */
    kiemnghiemHesoAnToaTrucII() {
        const T = this.#momentXoan;
        const ten_truc = this.#tenTruc;
        const result = this.tinhBangDuongKinhTheoMomenTuongDuong()
        //tiết diện bánh răng trụ nhỏ
        const tietdien1 = result.ketqua_Banhrangtrunho
        let cothen 
        if (tietdien1.Dtang11!='-') cothen = true 
        else cothen = false
        const ketqua_tietdien1 = this.tinhBang_4_6_TaiTietDien(tietdien1.Tietdientai, 104837.10, 248803.49, tietdien1.Dtieuchuan, cothen, this.getMomentXoan());
        // tiết diện ổ lăn
        const tietdien2 = result.ketqua_c
        if (tietdien2.Dtang11!='-') cothen = true 
        else cothen = false
        const ketqua_tietdien2 = this.tinhBang_4_6_TaiTietDien("ổ lăn", 0, 0, tietdien2.Dtieuchuan, cothen, this.getMomentXoan());
        // tiết diện bánh răng côn lớn
        const tietdien3 = result.ketqua_Banhrangconlon
        if (tietdien3.Dtang11!='-') cothen = true 
        else cothen = false
        const ketqua_tietdien3 = this.tinhBang_4_6_TaiTietDien(tietdien3.Tietdientai, 91879.78, 226314.5, tietdien3.Dtieuchuan, cothen, this.getMomentXoan());
        return {
            "ten_truc": ten_truc,
            ketqua_tietdien1,
            ketqua_tietdien2,
            ketqua_tietdien3
        };
    }

    /**
     * Kiểm nghiệm hệ số an toàn mỏi cho Trục III
     * Bảng 4.6: Kiểm nghiệm độ bền mỏi
     */
    kiemnghiemHesoAnToaTrucIII() {
        const T = this.#momentXoan;
        const ten_truc = this.#tenTruc;
        const result = this.tinhBangDuongKinhTheoMomenTuongDuong()
        // tiết diện bánh răng trụ lớn
        const tietdien1 = result.ketqua_Banhrangtrulon
        let cothen 
        if (tietdien1.Dtang11!='-') cothen = true 
        else cothen = false
        const ketqua_tietdien1 = this.tinhBang_4_6_TaiTietDien(tietdien1.Tietdientai, 81089.03, 368303.87, tietdien1.Dtieuchuan, cothen,this.getMomentXoan())
        // tiết diện ổ lăn
        const tietdien2 = result.ketqua_F
        if (tietdien2.Dtang11!='-') cothen = true 
        else cothen = false
        const ketqua_tietdien2 = this.tinhBang_4_6_TaiTietDien("ổ lăn", 0, 433125, tietdien1.Dtieuchuan, cothen, this.getMomentXoan())
        // tiết diện khớp nối
        const tietdien3 = result.ketqua_Khopnoi
        if (tietdien3.Dtang11!='-') cothen = true 
        else cothen = false
        const ketqua_tietdien3 = this.tinhBang_4_6_TaiTietDien(tietdien3.Tietdientai, 0, 0, tietdien1.Dtieuchuan, cothen, this.getMomentXoan())
        return {
            "ten_truc": ten_truc,
            ketqua_tietdien1,
            ketqua_tietdien2,
            ketqua_tietdien3
        };
    }

    /**
     * Kiểm nghiệm hệ số an toàn mỏi - Router
     */
    kiemnghiemHesoAnToa() {
        switch (this.getTenTruc()) {
            case "I":
                return this.kiemnghiemHesoAnToaTrucI();
            case "II":
                return this.kiemnghiemHesoAnToaTrucII();
            case "III":
                return this.kiemnghiemHesoAnToaTrucIII();
            default:
                throw new Error("Loại trục không hợp lệ!");
        }
    }
//==================================================================================================
    Tinh_g(Mmax,d){
        return Mmax/ (0.1 * Math.pow(d,3))
    }
    Tinh_T(Tmax,d){
        return Tmax/ (0.2 * Math.pow(d,3))
    }
    Tinh_gtd(g,t){
        const trongcan = Math.pow(g,2) + 3*Math.pow(t,2)
        return Math.sqrt(trongcan)
    }
    Tinh_bangkiemnghiemdobenquatai(result,tentruc){
        const mangTietDien = [
            result.result_tietdien1,
            result.result_tietdien2,
            result.result_tietdien3
        ];

        const tietDienMax = mangTietDien.reduce((max, current) => current.Mj > max.Mj ? current : max);

        const Mmax = Number(tietDienMax.Mj);
        let tenTietDienMax = tietDienMax.Tietdientai;
        if (tenTietDienMax === "ổ lăn" && this.getTenTruc()==='I') {
            tenTietDienMax = "A";
        } else if (tenTietDienMax === "ổ lăn" && this.getTenTruc()==='II') {
            tenTietDienMax = "C";
        } else if (tenTietDienMax === "ổ lăn" && this.getTenTruc()==='III') {
            tenTietDienMax = "F";
        }
        const ketqua = this.tinhBangDuongKinhTheoMomenTuongDuong();
        const mangKetQua = Object.values(ketqua);

        const ketQuaTuongUng = mangKetQua.find(kq => kq &&typeof kq === "object" &&kq.Tietdientai === tenTietDienMax);

        const d = Number(ketQuaTuongUng?.Dtieuchuan);
        const Tmax = Number(this.getMomentXoan());

        if (!d || isNaN(d)) {
            throw new Error(`Không tìm được Dtieuchuan cho tiết diện: ${tenTietDienMax}`);
        }

        const g = this.Tinh_g(Mmax, d);
        const t = this.Tinh_T(Tmax, d);
        const gtd = this.Tinh_gtd(g, t);

        return {
            tentruc,
            d,
            Mmax: (Mmax || 0).toFixed(2),
            Tmax: (Tmax || 0).toFixed(2),
            g: (g || 0).toFixed(2),
            t: (t || 0).toFixed(2),
            gtd: (gtd || 0).toFixed(2),
        };
    }
    kiemnghiemdobenquatai(){
        const tentruc = this.getTenTruc()
        const result = this.Kiemnghiemdobentruc()
        const ketqua_kiemnghiem = this.Tinh_bangkiemnghiemdobenquatai(result,tentruc)
        return ketqua_kiemnghiem
    }
   //----------------------------------------------Tính sơ bộ đường kính trục--------------------------------------
    /**momenxoan trên trục(N.mm)
     * t là ứng suất xoắn cho phép (Mpa=N/mm2)
    */
    Tinh_DK_d1(t){
        const momenxoan = this.getMomentXoan()
        const d1= Math.cbrt(momenxoan/(0.2*t))
        return d1
    }
    tim_bo(d) {
        const danhSach_d = [20, 25, 30, 35, 40 ,45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100 ]
        const danhSach_bo = [15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 47]
        const dtc=  danhSach_d.find( dTieuChuan => dTieuChuan === d)
        const b0 = danhSach_bo[danhSach_d.indexOf(dtc)]
        return b0
    }
    //================================== TÍNH TOÁN D1, LMRC, LMDT VỚI LỰA CHỌN CỦA USER ==================================
    //----------------------------------------------Tính chiều dài các đoạn trục--------------------------------------
    Tinh_gh_l_1_chung(d){
        const min = 1.2 * d
        const max = 1.4 * d
        return {
            min: min,
            max: max
        }
    }
    Tinh_gh_l_2_chung(d){
        const min = 1.2 * d
        const max = 1.5 * d
        return {
            min: min,
            max: max
        }
    }
    Tinh_gh_l_mkn_III(d){
        const l_mkn_min = 1.2 * d
        const l_mkn_max = 2.5 * d
        return {
            min: l_mkn_min,
            max: l_mkn_max
        }
    }
    
    getinfor(tenTruc, duongkinh, l1, l2) {
        const trucKey = `truc${tenTruc}`;
        const infor = this.#Thongtintruc[trucKey]
        if(!infor) {
            throw new Error(`Không tìm thấy thông tin cho trục ${tenTruc}`)
        }
        const d = infor[duongkinh]
        const l_1 = infor[l1]
        const l_2 = infor[l2]
        const result = {d, l_1, l_2}
        return {
           result
        }
    }
    //--------------------------------Phương trình cân bằng lực----------------------------------
    
    tinhDieuKienD1() {
        const danhSach_d = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100];
        let triSoUngSuat
        if(this.getTenTruc() == "I"||this.getTenTruc() == "II") {
            triSoUngSuat = 20
        }
        else{
            triSoUngSuat = 25
        }
        // Tính d1 sơ bộ
        const d1_sobo = this.Tinh_DK_d1(triSoUngSuat);
        
        // Lọc các giá trị d1 tiêu chuẩn >= d1_sobo
        const d1_danhSach = danhSach_d.filter(d => d >= d1_sobo);
        
        if (d1_danhSach.length === 0) {
            throw new Error(`Không tìm thấy giá trị d1 tiêu chuẩn phù hợp. d1 sơ bộ = ${d1_sobo} mm`);
        }
        
        return {
            tenTruc: this.#tenTruc,
            d1_sobo: d1_sobo,
            d1_danhSach: d1_danhSach
        };
    }
    tinh_gh_l_I(d1_selected) {
        const danhSach_d = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100];
        
        if (!danhSach_d.includes(d1_selected)) {
            throw new Error(`d1 = ${d1_selected} không phải là giá trị tiêu chuẩn. Danh sách: ${danhSach_d.join(", ")}`);
        }

        const gh_l_1 =this.Tinh_gh_l_1_chung(d1_selected);
        const gh_l_2 = this.Tinh_gh_l_2_chung(d1_selected);
        return {
            "gh_lmrc": gh_l_1,
            "gh_lmdt": gh_l_2,
        };
    }
    tinh_gh_l_II(d1_selected) {
        const danhSach_d = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100];
        
        if (!danhSach_d.includes(d1_selected)) {
            throw new Error(`d1 = ${d1_selected} không phải là giá trị tiêu chuẩn. Danh sách: ${danhSach_d.join(", ")}`);
        }

        const gh_l_1 =this.Tinh_gh_l_1_chung(d1_selected);
        const gh_l_2 = this.Tinh_gh_l_2_chung(d1_selected);
        return {
            "gh_lmrc": gh_l_1,
            "gh_lmrt": gh_l_2,
        };
    }
    tinh_gh_l_III(d1_selected) {
        const danhSach_d = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100];
        
        if (!danhSach_d.includes(d1_selected)) {
            throw new Error(`d1 = ${d1_selected} không phải là giá trị tiêu chuẩn. Danh sách: ${danhSach_d.join(", ")}`);
        }
        const lmrt =this.Tinh_gh_l_1_chung(d1_selected);
        const lmkn = this.Tinh_gh_l_mkn_III(d1_selected);
        
        return {
            "gh_lmrt": lmrt,
            "gh_lmkn": lmkn,
        };
    }
    Tinh_l_I(){
        const infor = this.getinfor("I", "d1", "lmrc", "lmdt")
        const d1 = infor.result.d
        const lmrc = infor.result.l_1
        const lmdt = infor.result.l_2
        const danhSach_d = this.tinhDieuKienD1()
        if (!danhSach_d.d1_danhSach.includes(d1)) {
            throw new Error(`d1 = ${d1} không phải là giá trị tiêu chuẩn. Danh sách: ${danhSach_d.d1_danhSach.join(", ")}`);
        }

        const gh_lmrc_lmdt = this.tinh_gh_l_I(d1)
        
        if (lmrc < gh_lmrc_lmdt.gh_lmrc.min || lmrc > gh_lmrc_lmdt.gh_lmrc.max) {
            throw new Error(`lmrc = ${lmrc} không nằm trong khoảng [${gh_lmrc_lmdt.gh_lmrc.min}, ${gh_lmrc_lmdt.gh_lmrc.max}]`);
        }
        if (lmdt < gh_lmrc_lmdt.gh_lmdt.min || lmdt > gh_lmrc_lmdt.gh_lmdt.max) {
            throw new Error(`lmdt = ${lmdt} không nằm trong khoảng [${gh_lmrc_lmdt.gh_lmdt.min}, ${gh_lmrc_lmdt.gh_lmdt.max}]`);
        }
        return {
            tenTruc: this.#tenTruc,
            d1: d1,
            gh_lmrc_lmdt: gh_lmrc_lmdt,
            lmrc: lmrc,
            lmdt: lmdt
        };
    }
    Tinh_l_II(){
        const infor = this.getinfor("II", "d2", "lmrc", "lmrt")
        const d2 = infor.result.d
        const lmrc = infor.result.l_1
        const lmrt = infor.result.l_2
        const danhSach_d = this.tinhDieuKienD1().d1_danhSach;
        if (!danhSach_d.includes(d2)) {
            throw new Error(`d2 = ${d2} không phải là giá trị tiêu chuẩn. Danh sách: ${danhSach_d.join(", ")}`);
        }
        const gh_lmrc_lmrt = this.tinh_gh_l_II(d2)
        if (lmrc < gh_lmrc_lmrt.gh_lmrc.min || lmrc > gh_lmrc_lmrt.gh_lmrc.max) {
            throw new Error(`lmrc = ${lmrc} không nằm trong khoảng [${gh_lmrc_lmrt.gh_lmrc.min}, ${gh_lmrc_lmrt.gh_lmrc.max}]`);
        }
        if (lmrt < gh_lmrc_lmrt.gh_lmrt.min || lmrt > gh_lmrc_lmrt.gh_lmrt.max) {
            throw new Error(`lmrt = ${lmrt} không nằm trong khoảng [${gh_lmrc_lmrt.gh_lmrt.min}, ${gh_lmrc_lmrt.gh_lmrt.max}]`);
        }
        return {
            tenTruc: this.#tenTruc,
            d2: d2,
            gh_lmrc_lmrt:  gh_lmrc_lmrt,
            lmrc: lmrc,
            lmrt: lmrt
        };
    }
    Tinh_l_III(){
        const infor = this.getinfor("III", "d3", "lmrt", "lmkn")
        const d3 = infor.result.d
        const lmrt = infor.result.l_1
        const lmkn = infor.result.l_2
        const danhSach_d = this.tinhDieuKienD1().d1_danhSach;
        if (!danhSach_d.includes(d3)) {
            throw new Error(`d3 = ${d3} không phải là giá trị tiêu chuẩn. Danh sách: ${danhSach_d.join(", ")}`);
        }
        const gh_lmrt_lmkn = this.tinh_gh_l_III(d3)
        if (lmrt < gh_lmrt_lmkn.gh_lmrt.min || lmrt > gh_lmrt_lmkn.gh_lmrt.max) {
            throw new Error(`lmrt = ${lmrt} không nằm trong khoảng [${gh_lmrt_lmkn.gh_lmrt.min}, ${gh_lmrt_lmkn.gh_lmrt.max}]`);
        }
        if (lmkn < gh_lmrt_lmkn.gh_lmkn.min || lmkn > gh_lmrt_lmkn.gh_lmkn.max) {
            throw new Error(`lmkn = ${lmkn} không nằm trong khoảng [${gh_lmrt_lmkn.gh_lmkn.min}, ${gh_lmrt_lmkn.gh_lmkn.max}]`);
        }
        return {
            tenTruc: this.#tenTruc,
            d3: d3,
            gh_lmrt_lmkn: gh_lmrt_lmkn,
            lmrt: lmrt,
            lmkn: lmkn
        };
    }

//========================================================================================================
    Tinh_gh_l_11(){
        const infor_truc_I = this.#Thongtintruc.trucI
        const d1 = infor_truc_I.d1
        const min = 2.5 * d1
        const max = 3 * d1
        return {
            min: min,
            max: max
        };
    }
//========================================================================================================
    Tinh_l_11(){
        const infor_truc_I = this.#Thongtintruc.trucI
        const l11 = infor_truc_I.l11
        return l11
    }
    Tinh_l_12( ){
        const infor = this.getinfor("I", "d1", "lmrc", "lmdt")
        const l_mdt = infor.result.l_2
        const d1 = infor.result.d
        const b0 = this.tim_bo(d1)
        const k3 = 16
        const hn =17.25
        const l_12= 0.5*(l_mdt+b0)+k3+hn
        return l_12
    }
    Tinh_l_13(){
        const l_11 = this.Tinh_l_11()
        const infor = this.getinfor("I", "d1", "lmrc", "lmdt")
        const l_mrc = infor.result.l_1
        const d1 = infor.result.d
        const b0 = this.tim_bo(d1)
        const k1=12.6
        const k2=10
        const b13=38
        const alpha = 17.62;
        const alphaRad = alpha * Math.PI / 180;
        const l_13= l_11+k1+k2+l_mrc+0.5*(b0-b13*Math.cos(alphaRad))
        return l_13
    }
    Tinh_By(Fa1,Fr1,Fr,dm1,l_11,l_12,l_13){
        const part1 = Fa1*(dm1/2)
        const part2 = Fr1*l_12
        const part3 = Fr*l_13
        const By = (-part1 + part2 + part3 )/l_11
        return By
    }
    Tinh_Bx(Ft1,l_11,l_12){
        const Bx = (Ft1*l_12)/l_11
        return Bx
    }
    Tinh_Ax(Bx,Ft1){
        const Ax= Bx + Ft1
        return Ax
    }
    Tinh_Ay(By,Fr1,Fr){
        const Ay = By + Fr1 - Fr
        return Ay
    }
    Tinh_Az(Fa1){
         const Az = Fa1
         return Az
    }
    Tinh_hetruc_I(Fa1, Fr1, Fr, Ft1,dm1){
        const l_11 = this.Tinh_l_11()
        const l_12 = this.Tinh_l_12()
        const l_13 = this.Tinh_l_13()
        const By = this.Tinh_By(Fa1,Fr1,Fr,dm1,l_11,l_12,l_13)
        const Bx = this.Tinh_Bx(Ft1,l_11,l_12)
        const Ax = this.Tinh_Ax(Bx,Ft1)
        const Ay = this.Tinh_Ay(By,Fr1,Fr)
        const Az = this.Tinh_Az(Fa1)
        return {
            By: Number((By || 0).toFixed(2)),
            Bx: Number((Bx || 0).toFixed(2)),
            Ax: Number((Ax || 0).toFixed(2)),
            Ay: Number((Ay || 0).toFixed(2)),
            Az: Number((Az || 0).toFixed(2))
        }
    }
//======================================================================================================
    Tinh_l_22(){
        const k1 = 12.5
        const k2 = 10
        const result = this.Tinh_l_II()
        const lmrc = result.lmrc
        const lmrt = result.lmrt
        const b0 = this.tim_bo(this.Tinh_l_II().d2)
        const l_22 = 0.5*(lmrt + b0) + k1 + k2
        return l_22
    }
    Tinh_l_23(){
        const l_22 = this.Tinh_l_22()
        const brc = 38
        const alpha = 72.38
        const alphaRad = alpha * Math.PI / 180;
        const result = this.Tinh_l_II()
        const lmrt = result.lmrt
        const k1 = 12.5
        const l_23 = l_22 + 0.5*(lmrt + brc * Math.cos(alphaRad)) + k1
        return l_23
    }
    Tinh_l_21(){
        const result = this.Tinh_l_II()
        const lmrt = result.lmrt
        const lmrc = result.lmrc
        const b0 = this.tim_bo(this.Tinh_l_II().d2)
        const k1 = 12.5
        const k2 = 10
        const l_21 = lmrt + lmrc + b0 + 3*k1 + 2*k2
        return l_21
    }
    Tinh_Dy(Fr3, l_22, Fr2, l_23, Fa2, dm2, l_21){
        const tu = Fr3*l_22 - Fr2*l_23 - (Fa2*dm2)/2
        const mau = l_21
        const Dy = tu/mau
        return Dy
    }
    Tinh_Dx(Ft3, l_22, Ft2, l_23, l_21 ){
        const tu = Ft3*l_22 + Ft2*l_23
        const mau = l_21
        const Dx = tu/mau
        return Dx
    }
    Tinh_Dz(Fa2){
        const Dz = Fa2
        return Dz
    }
    Tinh_Cx(Ft3, Ft2 , Dx){
        const Cx = Ft3 + Ft2 - Dx
        return Cx
    }
    Tinh_Cy(Fr3, Fr2, Dy){
        const Cy = Fr3 - Fr2 - Dy
        return Cy
    }
    Tinh_hetruc_II(Fr3, Fr2, Fa2, dm2, Ft3, Ft2){
        const l_22 = this.Tinh_l_22()
        const l_23 = this.Tinh_l_23()
        const l_21 = this.Tinh_l_21()
        const Dx = this.Tinh_Dx(Ft3, l_22, Ft2, l_23, l_21)
        const Dy = this.Tinh_Dy(Fr3, l_22, Fr2, l_23, Fa2, dm2, l_21)
        const Dz = this.Tinh_Dz(Fa2)
        const Cx = this.Tinh_Cx(Ft3,Ft2, Dx)
        const Cy = this.Tinh_Cy(Fr3, Fr2, Dy)
        return {
            Dx: Number((Dx || 0).toFixed(2)),
            Dy: Number((Dy || 0).toFixed(2)),
            Dz: Number((Dz || 0).toFixed(2)),
            Cx: Number((Cx || 0).toFixed(2)),
            Cy: Number((Cy || 0).toFixed(2))
        }
    }
//=============================================================================================================
    Tinh_l_33(l_21){
        const b0 = this.tim_bo(this.Tinh_l_III().d3)
        const k3 = 15
        const hn = 17
        const lmkn = this.Tinh_l_III().lmkn
        const l_33 = l_21 + b0/2 + k3 + hn + lmkn
        return l_33
    }
    Tinh_Fy(Fr5, l_32, l_31){
        const Fy = (Fr5 * l_32)/ l_31
        return Fy
    }
    Tinh_Fx(F6, l_33, Ft5, l_32, l_31){
        const tu = F6 * l_33 - Ft5 * l_32
        const Fx = tu / l_31
        return Fx
    }
    Tinh_Ex(Ft5, F6, Fx){
        const Ex = Ft5 + Fx - F6
        return Ex
    }
    Tinh_Ey(Fr5, Fy){
        const Ey = Fr5 - Fy
        return Ey
    }
    Tinh_hetruc_III(Fr5, Ft5, l_22, l_21){
        const F6 = 0.25 * ( (2* this.getMomentXoan()) /130)
        const l_31 = l_21
        const l_32 = l_22
        const l_33 = this.Tinh_l_33(l_21)
        const Fy = this.Tinh_Fy(Fr5, l_32, l_31)
        const Fx = this.Tinh_Fx(F6, l_33, Ft5, l_32, l_31)
        const Ex = this.Tinh_Ex(Ft5, F6, Fx)
        const Ey = this.Tinh_Ey(Fr5, Fy)
        return {
            Fx: Number((Fx || 0).toFixed(2)),
            Fy: Number((Fy || 0).toFixed(2)),
            Ex: Number((Ex || 0).toFixed(2)),
            Ey: Number((Ey || 0).toFixed(2))
        }
    }
//suport front end giới hạn chọn của người dùng
    Tinh_Min_max_lmrc_lmdt_I(){
        const infor = this.getinfor("I", "d1", "lmrc", "lmdt")
        const d1 = infor.result.d
        return this.tinh_gh_l_I(d1)
    }
    Tinh_Min_max_lmrc_lmrt_II(){
        const infor = this.getinfor("II", "d2", "lmrc", "lmrt")
        const d2 = infor.result.d
        return this.tinh_gh_l_II(d2)
    }
    Tinh_Min_max_lmrt_lmkn_III(){
        const infor = this.getinfor("III", "d3", "lmrt", "lmkn")
        const d3 = infor.result.d
        return this.tinh_gh_l_III(d3)
    }
}   


