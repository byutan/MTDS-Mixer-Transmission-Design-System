import { ThungTron } from "../models/ThungTron.js"
import { tinhHieuSuatHeThong, tinhTySoTruyenChungSoBo } from "./HeThongTruyenDong.services.js";

export const taoThungTron = (duLieuThungTron) => {
    return new ThungTron(duLieuThungTron || {})
}

export const tinhCongSuatCanThiet = (duLieuDauVao) => {
    const tTron = taoThungTron(duLieuDauVao.thungTron)
    const pThungTron = tTron.getCongSuat()

    const res = tinhHieuSuatHeThong(duLieuDauVao)
    const hieuSuatHeThong = res.hieuSuatHeThong

    const pCanThiet = Number(pThungTron / hieuSuatHeThong).toFixed(3)
    return {
        congSuatThungTron: pThungTron,
        hieuSuatHeThong: hieuSuatHeThong,
        congSuatCanThiet: pCanThiet
    }
}

export const tinhVongQuaySoBo = (duLieuDauVao) => {
    const tTron = taoThungTron(duLieuDauVao.thungTron)
    const soVongQuay = tTron.getSoVongQuay()

    const res = tinhTySoTruyenChungSoBo(duLieuDauVao)
    const vongQuaySoBo = Number(soVongQuay * res.tySoTruyenChungSoBo).toFixed(3)
    return {
        tySoTruyenChungSoBo: res.tySoTruyenChungSoBo,
        soVongQuay: soVongQuay,
        vongQuaySoBo: vongQuaySoBo
    }
}