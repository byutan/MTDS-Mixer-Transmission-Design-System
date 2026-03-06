import { HopGiamToc } from "../models/HopGiamToc.js";
import { BanhRangCon } from "../models/BanhRangCon.js";
import { BanhRangTru } from "../models/BanhRangTru.js";

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
    hgt=taoHGT(danhSachBanhRang);
    return {
        soCap: hgt.getSoCap(),
        hieuSuatHGT: Number(hgt.getHieuSuat().toFixed(3))
    }
}