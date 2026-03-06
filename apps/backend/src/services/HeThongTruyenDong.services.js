import { HeThongTruyenDongBuilder } from "../builders.interface/HeThongTruyenDong.builder.js";
import { taoHGT } from "../services/HopGiamToc.services.js";
import { NoiTrucVongDanHoi } from "../models/NoiTrucVongDanHoi.js";
import { BoTruyenDai } from "../models/BoTruyenDai.js";
import { OLan } from "../models/OLan.js";
import { DongCo } from "../models/DongCo.js";

// hàm tạo object
export const taoHeThongTruyenDong = (duLieuHeThong) => {
    const hgt = taoHGT(duLieuHeThong.hopGiamToc?.danhSachBanhRang);
    const khopNoi = new NoiTrucVongDanHoi(duLieuHeThong.noiTrucVongDanHoi || {});
    const dongCo = new DongCo(duLieuHeThong.dongCo || {});
    const boTruyenDai = new BoTruyenDai(duLieuHeThong.boTruyenDai || {});
    const oLan = new OLan(duLieuHeThong.oLan || {});

    const builder = new HeThongTruyenDongBuilder();
    return builder 
        .withDongCo(dongCo)
        .withHopGiamToc(hgt)
        .withNoiTrucVongDanHoi(khopNoi)
        .withBoTruyenDai(boTruyenDai)
        .withOLan(oLan)
        .build(); 
};


// hàm tính hiệu suất hệ thống
export const tinhHieuSuatHeThong = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao.heThongTruyenDong);
    return {
        soTruc: heThong.hopGiamToc.getSoCap() + 1,
        hieuSuatHeThong: Number(heThong.tinhHieuSuatHeThong().toFixed(3))
    };
};

// hàm tính tỷ số truyền chung sơ bộ
export const tinhTySoTruyenChungSoBo = (duLieuDauVao) => {
    const heThong = taoHeThongTruyenDong(duLieuDauVao.heThongTruyenDong);
    return {
        tySoTruyenHGT: heThong.hopGiamToc.getTySoTruyenSoBo(),
        tySoTruyenDai: heThong.boTruyenDai.getTySoTruyenSoBo(),
        tySoTruyenChungSoBo: Number(heThong.tinhTySoTruyenChungSoBo()).toFixed(3)
    }
}