
/**
 * Theo tài liệu [2] (bảng 6.1 trang 91)
 */
export const VAT_LIEU_THEO_DO_CUNG = [
    {
        nhanHieu: "40",
        nhietLuyen: "Tôi cải thiện",
        kichThuoc: 60,
        doRan: "HB 192 .. 228",
        gioiHanBenUon: 700,    // MPa
        gioiHanBenCat: 400      // MPa
    },
    {
        nhanHieu: "45",
        nhietLuyen: "Thường hóa",
        kichThuoc: 80,
        doRan: "HB 170 .. 217",
        gioiHanBenUon: 600,
        gioiHanBenCat: 340
    },
    {
        nhanHieu: "50",
        nhietLuyen: "Thường hóa",
        kichThuoc: 80,
        doRan: "HB 179 .. 228",
        gioiHanBenUon: 640,
        gioiHanBenCat: 350
    },
    {
        nhanHieu: "40X",
        nhietLuyen: "Tôi cải thiện",
        kichThuoc: 100,
        doRan: "HB 230 .. 260",
        gioiHanBenUon: 850,
        gioiHanBenCat: 550
    },
    {
        nhanHieu: "45X",
        nhietLuyen: "Tôi cải thiện",
        kichThuoc: "100 .. 300",
        doRan: "HB 163 .. 269",
        gioiHanBenUon: 850,
        gioiHanBenCat: 650
    },
    {
        nhanHieu: "40XH",
        nhietLuyen: "Tôi cải thiện",
        kichThuoc: "100 .. 300",
        doRan: "HB 230 .. 280",
        gioiHanBenUon: 850,
        gioiHanBenCat: 600
    },
    {
        nhanHieu: "35XM",
        nhietLuyen: "Tôi cải thiện",
        kichThuoc: 100,
        doRan: "HB 241",
        gioiHanBenUon: 900,
        gioiHanBenCat: 800
    },
    {
        nhanHieu: "20X",
        nhietLuyen: "Thấm cabon",
        kichThuoc: 60,
        doRan: "HRC 46 .. 53",
        gioiHanBenUon: 650,
        gioiHanBenCat: 400
    },
    {
        nhanHieu: "12XH3A",
        nhietLuyen: "Thấm cabon",
        kichThuoc: 60,
        doRan: "HRC 56 .. 63",
        gioiHanBenUon: 900,
        gioiHanBenCat: 700
    },
    {
        nhanHieu: "25XRT",
        nhietLuyen: "Thấm cabon",
        kichThuoc: '-',
        doRan: "HRC 58 .. 63",
        gioiHanBenUon: 1150,
        gioiHanBenCat: 950
    },
    {
        nhanHieu: "45JI",
        nhietLuyen: "Thường hoá",
        kichThuoc: "-",
        doRan: "-",
        gioiHanBenUon: 550,
        gioiHanBenCat: 320
    },
    {
        nhanHieu: "30XHMJI",
        nhietLuyen: "Thường hoá",
        kichThuoc: "-",
        doRan: "-",
        gioiHanBenUon: 700,
        gioiHanBenCat: 550
    },
    {
        nhanHieu: "40XJI",
        nhietLuyen: "Thường hoá",
        kichThuoc: "-",
        doRan: "-",
        gioiHanBenUon: 650,
        gioiHanBenCat: 500
    },
    {
        nhanHieu: "35XMJI",
        nhietLuyen: "Thường hoá",
        kichThuoc: '-',
        doRan: '-',
        gioiHanBenUon: 700,
        gioiHanBenCat: 550
    }
];

/**
 * Hệ số ảnh hưởng của ứng suất trung bình
 * Theo bảng 10.7 trang 197
 */
export const HE_SO_ANH_HUONG = {
    psi_sigma: 0.1,    // Hệ số ảnh hưởng đối với ứng suất pháp
    psi_tau: 0.05      // Hệ số ảnh hưởng đối với ứng suất xoắn
};

/**
 * Hệ số giảm giới hạn mỏi do trạng thái bề mặt
 * Theo bảng 10.8 trang 197
 */
export const HE_SO_GIAM_GIOI_HAN = {
    Ra_025_063: {  // Bề mặt được xử lý phay, tôi
        K_sigma: 1.09,
        K_tau: 1.09
    },
    Ra_100_160: {  // Bề mặt thường
        K_sigma: 1.15,
        K_tau: 1.15
    },
    Ra_160_250: {
        K_sigma: 1.25,
        K_tau: 1.25
    }
};

/**
 * Hệ số tập trung ứng suất do trạng thái hình học
 * Theo bảng 10.12 trang 199
 */
export const HE_SO_TAP_TRUNG = {
    K_sigma_o: 1.95,   // Ổ trơn
    K_tau_o: 1.8,      // Ổ trơn
    
    K_sigma_kip: 1.6,  // Kip
    K_tau_kip: 1.5,
    
    K_sigma_then: 1.8, // Lỗ khoá (then)
    K_tau_then: 1.8
};

/**
 * Chỉ số kích thước (ε_σ, ε_τ)
 * Theo bảng 10.10 trang 198
 */
export const CHI_SO_KICH_THUOC = {
    d_20_30: {
        epsilon_sigma: 0.93,
        epsilon_tau: 0.88
    },
    d_30_50: {
        epsilon_sigma: 0.89,
        epsilon_tau: 0.83
    },
    d_50_100: {
        epsilon_sigma: 0.85,
        epsilon_tau: 0.78
    },
    d_100_200: {
        epsilon_sigma: 0.81,
        epsilon_tau: 0.74
    }
};

/**
 * Hệ số K_y cho ứng suất khác nhau
 * Theo bảng 10.9 trang 197
 */
export const HE_SO_K_Y = {
    uon: 1.4,      // Uốn
    xoan: 1.0,     // Xoắn
    phapXoan: 1.1  // Pháp xoắn
};

/**
 * Hệ số K_x từ các tiêu điện khác
 * Có thể thay đổi từ 1 đến 1.4 tùy thuộc vào trang thái
 */
export const HE_SO_K_X = {
    truc: 1.09,
    maycong: 1.15,
    maydem: 1.25
};

/**
 * Các tiêu chuẩn về ứng suất cho phép
 * Theo công thức 9.1 và 9.2 trang 173
 */
export const UNGSUATCHOPHEP = {
    may_co_kinh_vat_lieu_mayo: 100,     // MPa
    may_co_kinh_vat_lieu_thep_cao: 120,
    may_co_kinh_vat_lieu_dia_cat: 60,   // MPa xoắn
    may_diem: 80,
    may_diem_thep: 120
};

/**
 * Bảng kích thước tiêu chuẩn của then
 * Theo bảng 4.2 trang 60
 */
export const KICH_THUOC_THEN = [
    { d_truc: 28, b: 8, h: 7, t1: 4, t2: 2.8, l_dto: 45 },
    { d_truc: 32, b: 8, h: 7, t1: 4, t2: 2.8, l_dto: 50 },
    { d_truc: 35, b: 8, h: 7, t1: 4, t2: 2.8, l_dto: 50 },
    { d_truc: 38, b: 10, h: 8, t1: 5, t2: 3, l_dto: 60 },
    { d_truc: 42, b: 10, h: 8, t1: 5, t2: 3, l_dto: 60 },
    { d_truc: 45, b: 12, h: 8, t1: 5, t2: 3, l_dto: 70 },
    { d_truc: 50, b: 12, h: 8, t1: 5, t2: 3, l_dto: 70 },
    { d_truc: 55, b: 14, h: 9, t1: 5.5, t2: 3.5, l_dto: 80 },
    { d_truc: 60, b: 16, h: 10, t1: 6, t2: 4, l_dto: 90 },
    { d_truc: 65, b: 18, h: 11, t1: 7, t2: 4, l_dto: 100 },
    { d_truc: 70, b: 20, h: 12, t1: 7.5, t2: 4.5, l_dto: 110 }
];

/**
 * Công thức tính giới hạn mỏi từ vật liệu
 * Theo công thức 10.19 trang 195
 */
export const CONG_THUC_GIOI_HAN_MOI = {
    sigma_minus_1: (sigma_b) => 0.436 * sigma_b,  // Giới hạn mỏi uốn
    tau_minus_1: (sigma_minus_1) => 0.58 * sigma_minus_1  // Giới hạn mỏi xoắn
};

/**
 * Công thức tính ứng suất cho phép từ độ cứng
 * Theo công thức 10.20 và 10.21 trang 195
 */
export const CONG_THUC_UNGSUATCHOPHEP = {
    // Ứng suất bên trong then
    sigma_d_then: (sigma_ch) => 2 * sigma_ch / (2 * (10 + sigma_ch / 100)),
    
    // Ứng suất cắt trong then
    tau_c_then: (sigma_ch) => 0.6 * sigma_ch,
    
    // Ứng suất lích hợp
    sigma_td: (sigma_pap, tau_pap) => Math.sqrt(sigma_pap * sigma_pap + 3 * tau_pap * tau_pap)
};

/**
 * Các hằng số công thức tính toán
 */
export const HANG_SO = {
    // Công thức 4.22: σ = M_max / (0.1 * d³)
    he_so_moment_uon: 0.1,
    
    // Công thức 4.23: τ = T_max / (0.2 * d³)
    he_so_moment_xoan: 0.2,
    
    // Công thức 4.24: [σ] ≈ 0.8 * σ_ch
    he_so_ungsuatchophep: 0.8,
    
    // Công thức 4.25-4.26: Ứng suất ổ lăn
    he_so_olanben: 2,      // (2*T) / (d_tr * (h - t_1))
    he_so_olancat: 2,      // (2*T) / (d_tr * b)
    
    // Công thức 4.27-4.28: Chiều dài then
    he_so_then_mayo_min: 0.8,
    he_so_then_mayo_max: 0.9,
    he_so_then_bo_min: 0.8,
    he_so_then_bo_max: 0.9,
    
    // Tính moment chống uốn: W_j = (π*d³)/32
    he_so_moment_chon_uon: Math.PI / 32,
    
    // Tính moment chống xoắn: W_oj = (π*d³)/16
    he_so_moment_chon_xoan: Math.PI / 16
};

/**
 * Lấy vật liệu theo nhân hiệu
 */
export const layVatLieu = (nhanHieu) => {
    return VAT_LIEU_THEO_DO_CUNG.find(vl => vl.nhanHieu === nhanHieu);
};

/**
 * Lấy kích thước then tiêu chuẩn theo đường kính trục
 */
export const layThenTieuChuan = (d_truc) => {
    return KICH_THUOC_THEN.find(then => then.d_truc >= d_truc);
};

/**
 * Tính giới hạn mỏi từ giới hạn bền
 */
export const tinhGioiHanMoi = (gioiHanBen) => {
    return {
        sigma_minus_1: CONG_THUC_GIOI_HAN_MOI.sigma_minus_1(gioiHanBen),
        tau_minus_1: CONG_THUC_GIOI_HAN_MOI.tau_minus_1(
            CONG_THUC_GIOI_HAN_MOI.sigma_minus_1(gioiHanBen)
        )
    };
};

/**
 * Lấy chỉ số kích thước dựa trên đường kính trục
 */
export const layChiSoKichThuoc = (d) => {
    if (d >= 20 && d <= 30) return CHI_SO_KICH_THUOC.d_20_30;
    if (d > 30 && d <= 50) return CHI_SO_KICH_THUOC.d_30_50;
    if (d > 50 && d <= 100) return CHI_SO_KICH_THUOC.d_50_100;
    if (d > 100 && d <= 200) return CHI_SO_KICH_THUOC.d_100_200;
    return CHI_SO_KICH_THUOC.d_30_50; // Mặc định
};
