import { Truc } from "../models/Truc.js";
import { tinhBangDacTinhKyThuat, tinhThongSoBoTruyenDaiThang, tinhThongSoBoTruyenBanhRangTru } from "./HeThongTruyenDong.services.js";
import { tinhToanHinhHoc } from "./BanhRangCon.services.js";
const laytruc = (duLieuDauVao, matruc) =>{
    const ketQuaBangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao);
    const data_truc = ketQuaBangDacTinh.find((item) => item?.truc === matruc);
    if(!data_truc) {
         throw new Error("Không tìm thấy trục !");
    }
    const {
        truc: tenTruc,
        congSuat,
        tySoTruyen,
        soVongQuay,
        momentXoan,
    } = data_truc ;
    
    // Lấy nhanhieuthep, nhietluyen và Thongtintruc từ input người dùng
    const trucUserInput = duLieuDauVao.heThongTruyenDong?.truc || {};
    const nhanhieuthep = trucUserInput.nhanhieuthep;
    const nhietluyen = trucUserInput.nhietluyen;
    const Thongtintruc = trucUserInput.Thongtintruc || {};
    
    if (typeof tenTruc !== "string" || !tenTruc.trim()) {
        throw new Error("Tên trục không phải là chuỗi rỗng !");
    }
    if (typeof nhanhieuthep !== "string" || !nhanhieuthep?.trim()) {
        throw new Error("Nhành hiệu thép không hợp lệ !");
    }
    if (typeof nhietluyen !== "string" || !nhietluyen?.trim()) {
        throw new Error("Nhiệt luyện không hợp lệ !");
    }
    if (typeof congSuat !== "number" || congSuat <= 0) {
        throw new Error("Công suất phải là số dương !");
    }
    if (typeof soVongQuay !== "number" || soVongQuay <= 0) {
        throw new Error("Số vòng quay phải là số dương !");
    }
    if (typeof momentXoan !== "number" || momentXoan <= 0) {
        throw new Error("Moment xoắn không hợp lệ cho Trục !");
    }
    if (typeof tySoTruyen !== "number" || tySoTruyen <= 0) {
        throw new Error("Tỷ số truyền không hợp lệ cho Trục !");
    }
     const truc = new Truc({
        tenTruc,
        congSuat,
        tySoTruyen,
        soVongQuay,
        momentXoan,
        nhanhieuthep,
        nhietluyen,
        Thongtintruc,
    });
    return truc;
}
export const tinhBangDuongKinh_trucI = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"I")
    return truc.tinhBangDuongKinhTheoMomenTuongDuong()
};
export const tinhBangDuongKinh_trucII = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"II")
    return truc.tinhBangDuongKinhTheoMomenTuongDuong() 
};
export const tinhBangDuongKinh_trucIII = (duLieuDauVao) => {
   const truc = laytruc(duLieuDauVao,"III")
   return truc.tinhBangDuongKinhTheoMomenTuongDuong()
};
//=================================================================
export const tinhBang_4_5_trucI = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"I")
    return truc.Kiemnghiemdobentruc()
};
export const tinhBang_4_5_trucII = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"II")
    return truc.Kiemnghiemdobentruc()
};
export const tinhBang_4_5_trucIII = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"III")
    return truc.Kiemnghiemdobentruc()
};
//=================================================================
export const kiemnghiem_HesoAnToa_trucI = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"I")
    return truc.kiemnghiemHesoAnToa()
};

export const kiemnghiem_HesoAnToa_trucII = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"II")
    return truc.kiemnghiemHesoAnToa()
};

export const kiemnghiem_HesoAnToa_trucIII = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"III")
    return truc.kiemnghiemHesoAnToa()
};
//=================================================================
export const Kiemnghiemdobenquatai_truc_I = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"I")
    return truc.kiemnghiemdobenquatai()
};

export const Kiemnghiemdobenquatai_truc_II = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"II")
    return truc.kiemnghiemdobenquatai()
};
export const Kiemnghiemdobenquatai_truc_III = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"III")
    return truc.kiemnghiemdobenquatai()
};
//=================================================================
// TÍNH TOÁN D1, LMRC, LMDT VỚI LỰA CHỌN CỦA USER
//=================================================================
export const tinhDieuKienD1_Truc = (duLieuDauVao, matruc, triSoUngSuat) => {
    const truc = laytruc(duLieuDauVao, matruc);
    return truc.tinhDieuKienD1();
};

export const tinhDieuKienD1_trucI = (duLieuDauVao) => {
    return tinhDieuKienD1_Truc(duLieuDauVao, "I");
};

export const tinhDieuKienD1_trucII = (duLieuDauVao) => {
    return tinhDieuKienD1_Truc(duLieuDauVao, "II");
};

export const tinhDieuKienD1_trucIII = (duLieuDauVao) => {
    return tinhDieuKienD1_Truc(duLieuDauVao, "III");
};
//===================Tính các hệ trục I,II,III==============================================

export const tinh_he_Truc_I = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"I")
    const Tinhtoanhinhhoc = tinhToanHinhHoc(duLieuDauVao)
    const ThongsoBoTruyenDaiThang = tinhThongSoBoTruyenDaiThang(duLieuDauVao)
    const result_1 = Tinhtoanhinhhoc.bang_luc_tac_dung
    const Fr = ThongsoBoTruyenDaiThang.lucTacDungLenTruc
    return truc.Tinh_hetruc_I(result_1.Fa1, result_1.Fr1, Fr, result_1.Ft1, result_1.dm1)
};
export const tinh_he_Truc_II = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"II")
    const ThongsoBoTruyenBanhRangTru = tinhThongSoBoTruyenBanhRangTru(duLieuDauVao)
    const bangluctacdung_1 = ThongsoBoTruyenBanhRangTru.bangLucTacDung
    const Tinhtoanhinhhoc = tinhToanHinhHoc(duLieuDauVao)
    const bangluctacdung_2 = Tinhtoanhinhhoc.bang_luc_tac_dung
    const Fr2 = bangluctacdung_2.Fr2 // lực dọc trục
    const Fr3 = bangluctacdung_1.Fr1 // lực hướng tâm
    const Fa2 = bangluctacdung_2.Fr1 // lực dọc trục
    const dm2 = bangluctacdung_2.dm2
    const Ft3 = bangluctacdung_1.Ft1 // lực vòng
    const Ft2 = bangluctacdung_2.Ft1 
    return truc.Tinh_hetruc_II(Fr3, Fr2, Fa2, dm2, Ft3, Ft2)
};
export const tinh_he_Truc_III =(duLieuDauVao) =>{
    const truc_II = laytruc(duLieuDauVao,"II")
    const truc = laytruc(duLieuDauVao,"III")
    const ThongsoBoTruyenBanhRangTru = tinhThongSoBoTruyenBanhRangTru(duLieuDauVao)
    const bangluctacdung_1 = ThongsoBoTruyenBanhRangTru.bangLucTacDung
    const Ft5 = bangluctacdung_1.Ft1
    const Fr5 = bangluctacdung_1.Fr1
    const l_22 = truc_II.Tinh_l_22()
    const l_21 = truc_II.Tinh_l_21()
    return truc.Tinh_hetruc_III(Fr5, Ft5, l_22, l_21)
};
//=============================================sp front end===========================================
// Trục I
export const show_gioi_han_lmrc_lmdt_truc_I = (duLieuDauVao) => {
    const truc = laytruc (duLieuDauVao,"I")
    return truc.Tinh_Min_max_lmrc_lmdt_I()
}
export const show_gioi_han_l11_I = (duLieuDauVao) => {
    const truc = laytruc (duLieuDauVao,"I")
    return truc.Tinh_gh_l_11()
}
// Trục II
export const show_gioi_han_lmrc_lmrt_II = (duLieuDauVao) => {
    const truc = laytruc (duLieuDauVao,"II")
    return truc.Tinh_Min_max_lmrc_lmrt_II()
}
// Trục III

export const show_gioi_han_lmrt_lmkn_III = (duLieuDauVao) => {
    const truc = laytruc (duLieuDauVao,"III")
    return truc.Tinh_Min_max_lmrt_lmkn_III()
}
