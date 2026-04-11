export class DongCo {
    #kieuDongCo 
    #congSuat
    #vanTocQuay
    #heSoCongSuat
    #hieuSuat
    #tiSoMomentMax
    #tiSoMomentKhoiDong
    #taiTrong
    #soCaLamViec
    /**
     * @param {{ 
     * kieuDongCo: string,
     * congSuat: number,
     * vanTocQuay: number,
     * heSoCongSuat:number,
     * hieuSuat: number,
     * tiSoMomentMax: number,
     * tiSoMomentKhoiDong: number,
     * taiTrong: string,
     * soCaLamViec: number
     * }} params
     */
    constructor({kieuDongCo, congSuat, vanTocQuay, heSoCongSuat, hieuSuat, tiSoMomentMax, tiSoMomentKhoiDong, taiTrong, soCaLamViec} = {}) {
        this.#kieuDongCo = kieuDongCo 
        this.#congSuat = congSuat 
        this.#vanTocQuay = vanTocQuay 
        this.#heSoCongSuat = heSoCongSuat 
        this.#hieuSuat = hieuSuat 
        this.#tiSoMomentMax = tiSoMomentMax 
        this.#tiSoMomentKhoiDong = tiSoMomentKhoiDong 
        this.#taiTrong = taiTrong
        this.#soCaLamViec = soCaLamViec
    }

    // getter vanTocQuay
    getVanTocQuay() {
        return this.#vanTocQuay
    }

    getCongSuat() {
        return this.#congSuat
    }

    getTaiTrong() {
        return this.#taiTrong
    }

    getSoCaLamViec() {
        return this.#soCaLamViec
    }

    getTySoTaiTrongDongCo() {
        let taiTrong;
        if (this.#taiTrong === 'nhe') {
            taiTrong = 1.1
        } else if (this.#taiTrong === 'manh') {
            taiTrong = 1.25
        } else if (this.#taiTrong === 'tinh') {
            taiTrong = 1.0
        }
        if (this.#soCaLamViec === 2) {
            taiTrong += 0.1
        } else if (this.#soCaLamViec === 3) {
            taiTrong += 0.2
        }
        return Number((taiTrong).toFixed(1))
    }
}