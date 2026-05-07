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
    const hieuSuat = heThong.tinhHieuSuatHeThong();
    return {
        soTruc: (heThong.hopGiamToc?.getSoCap() || 0) + 1,
        hieuSuatHeThong: Number((hieuSuat || 0).toFixed(3))
    };
};

// hàm tính tỷ số truyền chung sơ bộ
export const tinhTySoTruyenChungSoBo = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    const u_chung = heThong.tinhTySoTruyenChungSoBo();
    return {
        tySoTruyenHGT: heThong.hopGiamToc?.getTySoTruyenSoBo() || 0,
        tySoTruyenDai: heThong.boTruyenDai?.getTySoTruyenSoBo() || 0,
        tySoTruyenChungSoBo: Number((u_chung || 0).toFixed(3))
    }
}

// hàm tính tỷ số truyền chung thực tế
export const tinhTySoTruyenChungThucTe = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    const u_thuc_te = heThong.tinhTySoTruyenChungThucTe();
    return {
        vanTocQuay: heThong.dongCo?.getVanTocQuay() || 0,
        soVongQuay: heThong.thungTron?.getSoVongQuay() || 0,
        tySoTruyenChungThucTe: Number((u_thuc_te || 0).toFixed(3))
    }
}

// hàm tính bảng đặc tính kỹ thuật của trục trong hộp giảm tốc
export const tinhBangDacTinhKyThuat = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    
    // Nếu trong payload đã có sẵn kết quả phân phối tỷ số truyền thì dùng luôn
    let ketQuaPhanPhoi = duLieuDauVao.heThongTruyenDong?.phanPhoiTySoTruyen;
    
    // Nếu chưa có (hoặc thiếu trường tySoTruyenBanhRang), mới thực hiện tính toán lại
    if (!ketQuaPhanPhoi?.tySoTruyenBanhRang) {
        const res = phanPhoiTySoTruyenCapBanhRang(duLieuDauVao);
        ketQuaPhanPhoi = {
            tySoTruyenBanhRang: res.phanPhoiTySoTruyen
        };
    }
    
    const BangDacTinh = heThong.tinhBangDacTinhKyThuat(ketQuaPhanPhoi);
    return BangDacTinh;
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

export const thietKeVoHopGiamToc = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao);
    const a_w = tinhThongSoBoTruyenBanhRangTru(duLieuDauVao).thongSoKichThuoc.khoangCachTruc_aw
    const ketQua = heThong.thietKeVoHopGiamToc(a_w)
    return ketQua
}

