import { HopGiamToc } from "../models/HopGiamToc.js";
import { BanhRangCon } from "../models/BanhRangCon.js";
import { BanhRangTru } from "../models/BanhRangTru.js";
import { tinhTySoTruyenChungThucTe } from "./HeThongTruyenDong.services.js";
import { BoTruyenDai } from "../models/BoTruyenDai.js";

export const taoHGT = (danhSachBanhRang) => {
    const hgt = new HopGiamToc()
    if (!danhSachBanhRang) {
        return hgt
    }
    danhSachBanhRang.forEach(banhRang => {
        if (banhRang.loai === "tru") {
            hgt.addBoTruyen(new BanhRangTru({
                capChinhXac: banhRang.capChinhXac,
                cheKin: banhRang.cheKin,
                hieuSuat: banhRang.hieuSuat
            }))
        } else if (banhRang.loai === "con") {
            hgt.addBoTruyen(new BanhRangCon({
                capChinhXac: banhRang.capChinhXac,
                cheKin: banhRang.cheKin,
                hieuSuat: banhRang.hieuSuat
            }))
        } else {
            throw new Error(`Type '${banhRang.loai}' is not available.`);
        }
    });
    return hgt
};

export const tinhHieuSuatHGT = (danhSachBanhRang) => {
    const hgt=taoHGT(danhSachBanhRang);
    return {
        tenHGT: hgt.constructor.name,
        soCap: hgt.getSoCap(),
        hieuSuatHGT: Number((hgt.getHieuSuat() || 0).toFixed(3))
    };
}

export const tinhTySoTruyenThucTe = (duLieuDauVao) => {
    const hgt=taoHGT(duLieuDauVao.HopGiamToc?.danhSachBanhRang)
    const ketQuaTySoTruyenChungHeThong = tinhTySoTruyenChungThucTe(duLieuDauVao)
    const uHeThong = ketQuaTySoTruyenChungHeThong.tySoTruyenChungThucTe

    const boTruyenDai = new BoTruyenDai(duLieuDauVao.heThongTruyenDong?.boTruyenDai || {});
    const uDai = boTruyenDai.getTySoTruyenSoBo();
    
    const uHGT = hgt.tinhTySoTruyenThucTe(uHeThong, uDai)
    return {
        tySoTruyenHGTSoBo: hgt.getTySoTruyenSoBo(),
        tySoTruyenThucTeHGT: Number((uHGT || 0).toFixed(2))
    };
}

export const phanPhoiTySoTruyenCapBanhRang = (duLieuDauVao) => {
    const hgt = taoHGT(duLieuDauVao.heThongTruyenDong?.hopGiamToc?.danhSachBanhRang)
    const heSoThietKe = duLieuDauVao.heThongTruyenDong?.hopGiamToc?.heSoThietKe
    if (!heSoThietKe) {
        throw new Error("Missing heSoThietKe in request body.");
    }
    const { K_be, psi_bd2, c_K } = heSoThietKe;

    if (K_be !== undefined) {
        if (K_be < 0.25 || K_be > 0.3) {
            throw new Error(`K_be (${K_be}) is out of [0.25, 0.3] range.`);
        }
    }
    if (psi_bd2 !== undefined) {
        if (psi_bd2 < 0.4 || psi_bd2 > 1.5) {
            throw new Error(`Psi_bd2 (${psi_bd2}) is out of [0.4, 1.5] range.`);
        }
    }
    if (c_K !== undefined) {
        if (c_K < 1 || c_K > 1.1) {
            throw new Error(`C_k (${c_K}) is out of [1.0, 1.1] range.`);
        }
    }
    const ketQuaTySoTruyenThucTe=tinhTySoTruyenThucTe(duLieuDauVao)
    const u_h = ketQuaTySoTruyenThucTe.tySoTruyenThucTeHGT

    const res = hgt.phanPhoiTySoTruyenCacCap({ u_h, k_be: K_be, psi_bd2, c_k: c_K });
    return {
        tySoTruyenThucTeHGT: Number((u_h || 0).toFixed(2)),
        phanPhoiTySoTruyen: res
    };
}
