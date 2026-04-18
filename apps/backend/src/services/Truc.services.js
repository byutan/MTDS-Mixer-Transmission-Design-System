import { Truc } from "../models/Truc.js";
import { tinhBangDacTinhKyThuat } from "./HeThongTruyenDong.services.js";

export const tinhBangDuongKinh_trucI = (duLieuDauVao) => {
    const ketQuaBangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao);
    const trucI = ketQuaBangDacTinh.find((item) => item?.truc === "I");
    if (!trucI) {
        throw new Error("Không tìm thấy trục I.");
    }
    const {
        truc: tenTruc,
        congSuat,
        tySoTruyen,
        soVongQuay,
        momentXoan,
    } = trucI;
    if (typeof tenTruc !== "string" || !tenTruc.trim()) {
        throw new Error("Tên trục không phải là chuỗi rỗng !");
    }
    if (typeof congSuat !== "number" || congSuat <= 0) {
        throw new Error("Công suất phải là số dương !");
    }
    if (typeof soVongQuay !== "number" || soVongQuay <= 0) {
        throw new Error("Số vòng quay phải là số dương !");
    }
    if (typeof momentXoan !== "number" || momentXoan <= 0) {
        throw new Error("Moment xoắn không hợp lệ cho Trục I !");
    }
    if (typeof tySoTruyen !== "number" || tySoTruyen <= 0) {
        throw new Error("Tỷ số truyền không hợp lệ cho Trục I !");
    }
    const truc = new Truc({
        tenTruc,
        congSuat,
        tySoTruyen,
        soVongQuay,
        momentXoan,
    });

    return truc.tinhBangDuongKinhTheoMomenTuongDuong_trucI();
};
export const tinhBangDuongKinh_trucII = (duLieuDauVao) => {
    const ketQuaBangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao);
    const trucII = ketQuaBangDacTinh.find((item) => item?.truc === "II");
     if (!trucII) {
        throw new Error("Không tìm thấy trục I.");
    }
     const {
        truc: tenTruc,
        congSuat,
        tySoTruyen,
        soVongQuay,
        momentXoan,
    } = trucII;
     if (typeof tenTruc !== "string" || !tenTruc.trim()) {
        throw new Error("Tên trục không phải là chuỗi rỗng !");
    }
    if (typeof congSuat !== "number" || congSuat <= 0) {
        throw new Error("Công suất phải là số dương !");
    }
    if (typeof soVongQuay !== "number" || soVongQuay <= 0) {
        throw new Error("Số vòng quay phải là số dương !");
    }
    if (typeof momentXoan !== "number" || momentXoan <= 0) {
        throw new Error("Moment xoắn không hợp lệ cho Trục I !");
    }
    if (typeof tySoTruyen !== "number" || tySoTruyen <= 0) {
        throw new Error("Tỷ số truyền không hợp lệ cho Trục I !");
    }
    const truc = new Truc({
        tenTruc,
        congSuat,
        tySoTruyen,
        soVongQuay,
        momentXoan,
    });
};