import { Truc } from "../models/Truc.js";
import { tinhBangDacTinhKyThuat } from "./HeThongTruyenDong.services.js";
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
    
    // Lấy nhanhieuthep, nhietluyen và dKinhTieuChuan từ input người dùng
    const trucUserInput = duLieuDauVao.heThongTruyenDong?.truc || {};
    const nhanhieuthep = trucUserInput.nhanhieuthep;
    const nhietluyen = trucUserInput.nhietluyen;
    const dKinhTieuChuan = trucUserInput.dKinhTieuChuan || {};
    
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
        dKinhTieuChuan,
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
export const tinhBang_4_5_trucI = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"I")
    return truc.kiemnghiemdobentruc()
};
export const tinhBang_4_5_trucII = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"II")
    return truc.kiemnghiemdobentruc()
};
export const tinhBang_4_5_trucIII = (duLieuDauVao) => {
    const truc = laytruc(duLieuDauVao,"III")
    return truc.kiemnghiemdobentruc()
};

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