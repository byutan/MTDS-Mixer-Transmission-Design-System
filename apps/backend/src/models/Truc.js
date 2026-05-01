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
    #dKinhTieuChuan
    /**
     * @param {{ 
     * tenTruc: string, 
     * congSuat: number, 
     * tySoTruyen: number | null, 
     * soVongQuay: number, 
     * momentXoan: number 
     * nhanhieuthep: string,
     * nhietluyen: string,
     * dKinhTieuChuan: object
     * }} params
     */
    constructor({ tenTruc, congSuat, tySoTruyen, soVongQuay, momentXoan, nhanhieuthep, nhietluyen, dKinhTieuChuan}) {
        this.#tenTruc = tenTruc;
        this.#congSuat = congSuat;
        this.#tySoTruyen = tySoTruyen; 
        this.#soVongQuay = soVongQuay; 
        this.#momentXoan = momentXoan; 
        this.#nhanhieuthep = nhanhieuthep;
        this.#nhietluyen = nhietluyen;
        this.#dKinhTieuChuan = dKinhTieuChuan || {};
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
        return this.#dKinhTieuChuan
    }
    /**
     * Lấy đường kính tiêu chuẩn cho một tiết diện cụ thể của một trục
     * @param {string} tenTruc - Tên trục (I, II, hoặc III)
     * @param {string} tenTietDien - Tên tiết diện
     * @returns {number} - Đường kính tiêu chuẩn
     */
    getDiameterForSection(tenTruc, tenTietDien) {
        const trucKey = `truc${tenTruc}`;
        const sectionDiameters = this.#dKinhTieuChuan[trucKey];
        if (!sectionDiameters || sectionDiameters[tenTietDien] === undefined) {
            throw new Error(`Không tìm thấy đường kính tiêu chuẩn cho trục ${tenTruc}, tiết diện ${tenTietDien}`);
        }
        return sectionDiameters[tenTietDien];
    }
    //----------------------------------------------Tính sơ bộ đường kính trục--------------------------------------
    /**momenxoan trên trục(N.mm)
     * t là ứng suất xoắn cho phép (Mpa=N/mm2)
    */
    Tinh_D_sobo(t){
        const momenxoan = this.#momentXoan
        const d1= Math.cbrt(momenxoan/(0.2*t))
        return d1
    }
    // hàm chọn d tiêu chuẩn và bo chiều rộng ổ (mm) dựa theo giáo trình Trịnh Chất - Lê Văn Uyển tập 1 trang 188 bảng 10.2 
    Chon_D1(d) {
        const danhSach_d = [20, 25, 30, 35, 40 ,45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100 ]
        const danhSach_bo = [15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 47]
        const dtc=  danhSach_d.find( dTieuChuan => dTieuChuan >= d) || d
        const bo = danhSach_bo[danhSach_d.indexOf(dtc)]
        return {
            "dTieuchuan": dtc,
            "boTieuChuan": bo
        }
    }
     //----------------------------------------------Tính chiều dài các đoạn trục--------------------------------------
    /** 
     * l_mrc là chiều dài mayo của bánh răng côn(mm)
     * d1 là đường kính trục nhỏ nhất(mm)
     */
    Tinh_l_mrc(d){
        const l_mrc = (1.2/1.4) * d
        return l_mrc
    }
    
    /**
     * l_mdt là chiều dài mayo bánh đai(mm)
     * d1 là đường kính trục nhỏ nhất(mm)
     */
    Tinh_l_mdt(d1){
        const l_mdt = (1.2/1.5) * d1
        return l_mdt
    }
   
    /**
     * l_11 là chiều dài đoạn trục 1_1 (mm)
     * d1 là đường kính trục nhỏ nhất(mm)
     */
    Tinh_l_11(d1){
        const l_11=(2.5/3)*d1
        return l_11
    }
   
     /**
     * l_12 là chiều dài đoạn trục 1_2 (mm)
     * l_mdt là chiều dài mayo bánh đai(mm)
     * b0 là chiều rộng ổ (mm)
     * k3,hn là kích thước kết cấu(mm)
     * với k3= 15 mm, hn=17(mm) (default) theo bảng 4.2 trang 60
     */
    Tinh_l_12(l_mdt,b0,k3=15,hn=17){
        const l_12= 0.5*(l_mdt+b0)+k3+hn
        return l_12
    }
    
        /**
     * l_13 là chiều dài đoạn trục 1_3 (mm)
     * l_11 là chiều dài đoạn trục 1_1 (mm)
     * k1,k2 là kích thước kết cấu(mm)
     * l_mrc là chiều dài mayo của bánh răng côn(mm)
     * b0 là chiều rộng ổ (mm)
     * b13 là chiều rộng bánh răng(mm)
     * alpha là góc côn (độ)
     * với k1= 12.6 mm, k2=10 mm (default) theo bảng 4.2 trang 60
     * b13=38 mm
     * alpha=17.62 độ
     */
    Tinh_l_13(l_11, k1=12.6, k2=10, l_mrc, b0, b13=38, alpha=17.62){
        const l_13= l_11+k1+k2+l_mrc+0.5*(b0-b13*Math.cos(alpha))
        return l_13
    }
   
    //--------------------------------Phương trình cân bằng lực----------------------------------
    /**
     * Cân bằng momen quanh trục x
     * Fa1 là lục dọc trục (N)
     * Fr1 là lực hướng tâm (N)
     * Fr là lực đai (N)
     * By là phản lực gối B theo phương y (N)
     * dm1 là đường kính trung bình (mm)
     * công thức trang 61 4.4
     */
    Tinh_By(Fa1,Fr1,Fr,dm1,l_11,l_12,l_13){
        const part1 = Fa1*(dm1/2)
        const part2 = Fr1*l_12
        const part3 = Fr*l_13
        const By = (-part1 + part2 + part3 )/l_11
        return By
    }

    /**
     * Cân bằng momen quanh trục y
     * Ft1 là lục vòng (N)
     * Bx là phản lực gối B theo phương x (N)
     * công thức trang 61 4.5
     */
    Tinh_Bx(Ft1,l_11,l_12){
        const Bx = (Ft1*l_12)/l_11
        return Bx
    }
    /**
     * Cân bằng lực
     * Ax, Ay, Az là phản lực gối A (N)
     * Bx là phản lực gối B theo phương x (N)
     * By là phản lực gối B theo phương y (N)
     * Fa1 là lực dọc trục (N)
     * Fr1 là lực hướng tâm (N)
     * Fr là lực đai (N)
     * Ft1 là lục vòng (N)
     * công thức trang 62 4.6, 4.7, 4.8
     */
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
            "Momentd": Number(Mtd.toFixed(2)),
            "Trisosuatchophep": t,
            "Dtuongduong": Number(dtd.toFixed(2)),
            "Dtang11": Number(d_tang_11.toFixed(2)),
            "Dtieuchuan": dtieuchuan
            }
        }
        else {
            d_tang_11 = '-'
         return {
            "Tietdientai": Ten_tietdien,
            "Momenxoan": momenxoan,
            "Momentd": Number(Mtd.toFixed(2)),
            "Trisosuatchophep": t,
            "Dtuongduong": Number(dtd.toFixed(2)),
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
                "Wj": Number(Wj.toFixed(2)) ,
                "Woj": Number(Woj.toFixed(2)),
                "Mj": Number(Mj.toFixed(2)),
                "Tj": Number(Tj.toFixed(2)),
                "g_aj": Number(g_aj.toFixed(2)),
                "T_aj": Number(T_aj.toFixed(2))
            }
        }
        else {
            return{
            "Tietdientai": Tietdien,
            "Wj": Number(Wj.toFixed(2)) ,
            "Woj": Number(Woj.toFixed(2)),
            "Mj": Number(Mj.toFixed(2)),
            "Tj": Number(Tj.toFixed(2)),
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
            sigma_j_safety = Number(this.Tinh_hesoantoanuon(sigma_minus_1, Kx_dj, sigma_aj, W_g, sigma_minus_1).toFixed(2));
            tau_j_safety = Number(this.Tinh_hesoantoanxoan(tau_minus_1, Ky_dj, tau_aj, W_t, tau_minus_1).toFixed(2));
            combined_safety = this.Tinh_HSAT(sigma_j_safety, tau_j_safety);
            combined_safety = Number(combined_safety.toFixed(2));
        } else if (sigma_aj !== "-") {
            sigma_j_safety = Number(this.Tinh_hesoantoanuon(sigma_minus_1, Kx_dj, sigma_aj, W_g, sigma_minus_1).toFixed(2));
        } else if (tau_aj !== "-") {
            tau_j_safety = Number(this.Tinh_hesoantoanxoan(tau_minus_1, Ky_dj, tau_aj, W_t, tau_minus_1).toFixed(2));
        }

        return {
            "Tietdientai": tenTietDien,
            "εσ": Number(epsilonSigma.toFixed(3)),
            "ετ": Number(epsilonTau.toFixed(3)),
            "Kσ": Kx,
            "Kτ": Ky,
            "Kσdj": Number(Kx_dj.toFixed(2)),
            "Kτdj": Number(Ky_dj.toFixed(2)),
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
            Mmax: Mmax.toFixed(2),
            Tmax: Tmax.toFixed(2),
            g: g.toFixed(2),
            t: t.toFixed(2),
            gtd: gtd.toFixed(2),
        };
    }
    kiemnghiemdobenquatai(){
        const tentruc = this.getTenTruc()
        const result = this.Kiemnghiemdobentruc()
        const ketqua_kiemnghiem = this.Tinh_bangkiemnghiemdobenquatai(result,tentruc)
        return ketqua_kiemnghiem
    }
}


