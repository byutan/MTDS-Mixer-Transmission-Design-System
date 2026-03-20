import { HeThongTruyenDong } from "../models/HeThongTruyenDong.js"

export class HeThongTruyenDongBuilder {
    #dongCo
    #hopGiamToc
    #noiTrucVongDanHoi
    #boTruyenDai
    #oLan
    #thungTron
    withDongCo(dongCo) {
        this.#dongCo = dongCo;
        return this;
    }
    withHopGiamToc(hopGiamToc) {
        this.#hopGiamToc = hopGiamToc;
        return this;
    }
    withBoTruyenDai(boTruyenDai) {
        this.#boTruyenDai = boTruyenDai;
        return this;
    }
    withNoiTrucVongDanHoi(noiTrucVongDanHoi) {
        this.#noiTrucVongDanHoi = noiTrucVongDanHoi;
        return this;
    }
    withOLan(oLan) {
        this.#oLan = oLan;
        return this;
    }
    withThungTron(thungTron) {
        this.#thungTron = thungTron;
        return this;

    }
    build() {
        if (!this.#dongCo || !this.#hopGiamToc|| !this.#noiTrucVongDanHoi|| !this.#boTruyenDai|| !this.#oLan || !this.#thungTron) {
            throw new Error (`Missing component in builder object.`)
        }
        return new HeThongTruyenDong({
            dongCo: this.#dongCo,
            hopGiamToc: this.#hopGiamToc,
            noiTrucVongDanHoi: this.#noiTrucVongDanHoi,
            boTruyenDai: this.#boTruyenDai,
            oLan: this.#oLan,
            thungTron: this.#thungTron
        });
    }
}