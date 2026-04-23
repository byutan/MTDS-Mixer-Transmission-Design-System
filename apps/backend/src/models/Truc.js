export class Truc {
    #tenTruc
    #congSuat
    #tySoTruyen
    #soVongQuay
    #momentXoan
    /**
     * @param {{ 
     * tenTruc: string, 
     * congSuat: number, 
     * tySoTruyen: number | null, 
     * soVongQuay: number, 
     * momentXoan: number 
     * }} params
     */
    constructor({ tenTruc, congSuat, tySoTruyen, soVongQuay, momentXoan }) {
        this.#tenTruc = tenTruc;
        this.#congSuat = congSuat;
        this.#tySoTruyen = tySoTruyen; 
        this.#soVongQuay = soVongQuay; 
        this.#momentXoan = momentXoan; 
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
        const dtc_daithang = 28
        
        const ketqua_daithang = this.Tinh_D_Tai_TietDien(ten_tietdien1, T, Mx_daithang, My_daithang, t, cothen_daithang, dtc_daithang)
        // tại A
        const ten_tietdien2 = "A"
        const Mx_A = 49390.85
        const My_A = 169012.6
        const cothen_A = false
        const dtc_A = 35
        const ketqua_A = this.Tinh_D_Tai_TietDien(ten_tietdien2, T, Mx_A, My_A, t, cothen_A, dtc_A)
        // tại B
        const ten_tietdien3 = "B"
        const Mx_B = 57901.2
        const My_B = 0
        const cothen_B = false
        const dtc_B = 35
        const ketqua_B = this.Tinh_D_Tai_TietDien(ten_tietdien3, T, Mx_B, My_B, t, cothen_B, dtc_B)
        // tại bánh răng côn nhỏ
         const ten_tietdien4 = "Bánh răng côn nhỏ"
        const Mx_connho = 9238.35
        const My_connho = 0
        const cothen_connho = true
        const dtc_connho = 28
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
        const dtc_c = 40
        const ketqua_c = this.Tinh_D_Tai_TietDien(ten_tietdien1, 0, Mx_c, My_c, t, cothen_c, dtc_c)
        // tại Bánh răng trụ nhỏ
        const ten_tietdien2 = "Bánh răng trụ nhỏ"
        const Mx_Banhrangtrunho = 104837.10
        const My_Banhrangtrunho = 248803.49
        const cothen_Banhrangtrunho = true
        const dtc_Banhrangtrunho = 45
        const ketqua_Banhrangtrunho = this.Tinh_D_Tai_TietDien(ten_tietdien2, T, Mx_Banhrangtrunho, My_Banhrangtrunho, t, cothen_Banhrangtrunho, dtc_Banhrangtrunho)
        // tại Bánh răng côn lớn
        const ten_tietdien3 = "Bánh răng côn lớn"
        const Mx_Banhrangconlon = 91879.78
        const My_Banhrangconlon = 226314.5
        const cothen_Banhrangconlon = true
        const dtc_Banhrangconlon = 45
        const ketqua_Banhrangconlon = this.Tinh_D_Tai_TietDien(ten_tietdien3, T, Mx_Banhrangconlon, My_Banhrangconlon, t, cothen_Banhrangconlon, dtc_Banhrangconlon)
        // tại D
         const ten_tietdien4 = "D"
        const Mx_D = 0
        const My_D = 0
        const cothen_D = false
        const dtc_D = 40
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
        const dtc_E = 65
        const ketqua_E = this.Tinh_D_Tai_TietDien(ten_tietdien1, 0, Mx_E, My_E, t, cothen_E, dtc_E)
        // tại Bánh răng trụ lớn
        const ten_tietdien2 = "Bánh răng trụ lớn"
        const Mx_Banhrangtrulon = 81089.03
        const My_Banhrangtrulon = 368303.87
        const cothen_Banhrangtrulon = true
        const dtc_Banhrangtrulon = 70
        const ketqua_Banhrangtrulon = this.Tinh_D_Tai_TietDien(ten_tietdien2, T, Mx_Banhrangtrulon, My_Banhrangtrulon, t, cothen_Banhrangtrulon, dtc_Banhrangtrulon)
        // tại F
        const ten_tietdien3 = "F"
        const Mx_F = 0
        const My_F = 433125
        const cothen_F = false
        const dtc_F = 65
        const ketqua_F = this.Tinh_D_Tai_TietDien(ten_tietdien3, T, Mx_F, My_F, t, cothen_F, dtc_F)
        // tại Khớp nối
         const ten_tietdien4 = "Khớp nối"
        const Mx_Khopnoi = 0
        const My_Khopnoi = 0
        const cothen_Khopnoi = true
        const dtc_Khopnoi = 60
        const ketqua_Khopnoi = this.Tinh_D_Tai_TietDien(ten_tietdien4, T, Mx_Khopnoi, My_Khopnoi, t, cothen_Khopnoi, dtc_Khopnoi)
        return {
            ten_truc,
            ketqua_E,
            ketqua_Banhrangtrulon,
            ketqua_F,
            ketqua_Khopnoi
        };
    }
    //--------------------------------Kiểm nghiệm độ bền mỏi----------------------------------
    /**
     * Sj là Hệ số an toàn tổng
     * S_gj là hệ số an toàn uốn
     * S_tj là hệ số an toàn xoắn
     * công thức trang 63 4.9
     */
    Tinh_HSAT(S_gj, S_tj){
        const tu = S_gj * S_tj
        const mau = Math.sqrt(Math.pow(S_gj, 2) + Math.pow(S_tj, 2))
        const Sj = tu/mau
        return Sj
    }
    /**
     * Hệ số an toàn ứng suất pháp
     * S_gj là hệ số an toàn uốn
     * g_1 là giới hạn mỏi uốn (Mpa)
     * g-aj là biên độ ứng suất pháp (Mpa)
     * g_mj là ứng suất trung bình (Mpa)
     * K là Hệ số giảm giới hạn mỏi
     * psi là Hệ số xét đến ảnh hưởng của ứng suất trung bình đến giới hạn mỏi của vật liệu
     */
    Tinh_S_gj(g_1, g_aj, g_mj){

    }
}
