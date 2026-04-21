import { HeThongTruyenDongBuilder } from "../builders.interface/HeThongTruyenDong.builder.js";
import { taoHGT, phanPhoiTySoTruyenCapBanhRang } from "../services/HopGiamToc.services.js";
import { NoiTrucVongDanHoi } from "../models/NoiTrucVongDanHoi.js";
import { BoTruyenDai } from "../models/BoTruyenDai.js";
import { OLan } from "../models/OLan.js";
import { DongCo } from "../models/DongCo.js";
import { ThungTron } from "../models/ThungTron.js";

// hàm tạo object
export const taoHeThongTruyenDong = (duLieuDauVao) => {
    const duLieuHeThong = duLieuDauVao.heThongTruyenDong || {};
    const hgt = taoHGT(duLieuHeThong.hopGiamToc?.danhSachBanhRang);
    const khopNoi = new NoiTrucVongDanHoi(duLieuHeThong.noiTrucVongDanHoi || {});
    const dongCo = new DongCo(duLieuHeThong.dongCo || {});
    const boTruyenDai = new BoTruyenDai(duLieuHeThong.boTruyenDai || {});
    const oLan = new OLan(duLieuHeThong.oLan || {});
    const thungTron = new ThungTron(duLieuDauVao.thungTron || {});

    const builder = new HeThongTruyenDongBuilder();
    return builder 
        .withDongCo(dongCo)
        .withHopGiamToc(hgt)
        .withNoiTrucVongDanHoi(khopNoi)
        .withBoTruyenDai(boTruyenDai)
        .withOLan(oLan)
        .withThungTron(thungTron)
        .build(); 
};


// hàm tính hiệu suất hệ thống
export const tinhHieuSuatHeThong = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    return {
        soTruc: heThong.hopGiamToc.getSoCap() + 1,
        hieuSuatHeThong: Number(heThong.tinhHieuSuatHeThong().toFixed(3))
    };
};

// hàm tính tỷ số truyền chung sơ bộ
export const tinhTySoTruyenChungSoBo = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    return {
        tySoTruyenHGT: heThong.hopGiamToc.getTySoTruyenSoBo(),
        tySoTruyenDai: heThong.boTruyenDai.getTySoTruyenSoBo(),
        tySoTruyenChungSoBo: Number(heThong.tinhTySoTruyenChungSoBo()).toFixed(3)
    }
}

// hàm tính tỷ số truyền chung thực tế
export const tinhTySoTruyenChungThucTe = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    return {
        vanTocQuay: heThong.dongCo.getVanTocQuay(),
        soVongQuay: heThong.thungTron.getSoVongQuay(),
        tySoTruyenChungThucTe: Number(heThong.tinhTySoTruyenChungThucTe()).toFixed(3)
    }
}

// hàm tính bảng đặc tính kỹ thuật của trục trong hộp giảm tốc
export const tinhBangDacTinhKyThuat = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    const ketQuaPhanPhoi = phanPhoiTySoTruyenCapBanhRang(duLieuDauVao)
    const BangDacTinh = heThong.tinhBangDacTinhKyThuat(ketQuaPhanPhoi)
    return BangDacTinh
}

export const tinhThongSoBoTruyenDaiThang = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    const ketQua = heThong.tinhThongSoBoTruyenDaiThang()
    return ketQua
}

export const tinhThongSoBoTruyenBanhRangTru = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    const heSoThietKe = duLieuDauVao.heThongTruyenDong?.hopGiamToc?.heSoThietKe
    const ketQua = heThong.tinhThongSoBoTruyenBanhRangTru(heSoThietKe, tinhBangDacTinhKyThuat(duLieuDauVao))
    return ketQua
}