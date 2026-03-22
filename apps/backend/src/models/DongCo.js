export class DongCo {
    #kieuDongCo 
    #congSuat
    #vanTocQuay
    #heSoCongSuat
    #hieuSuat
    #tiSoMomentMax
    #tiSoMomentKhoiDong
    /**
     * @param {{ 
     * kieuDongCo: string,
     * congSuat: number,
     * vanTocQuay: number,
     * heSoCongSuat:number,
     * hieuSuat: number,
     * tiSoMomentMax: number,
     * tiSoMomentKhoiDong: number
     * }} params
     */
    constructor({kieuDongCo, congSuat, vanTocQuay, heSoCongSuat, hieuSuat, tiSoMomentMax, tiSoMomentKhoiDong} = {}) {
        this.#kieuDongCo = kieuDongCo 
        this.#congSuat = congSuat 
        this.#vanTocQuay = vanTocQuay 
        this.#heSoCongSuat = heSoCongSuat 
        this.#hieuSuat = hieuSuat 
        this.#tiSoMomentMax = tiSoMomentMax 
        this.#tiSoMomentKhoiDong = tiSoMomentKhoiDong 
    }

    // getter vanTocQuay
    getVanTocQuay() {
        return this.#vanTocQuay
    }

    getCongSuat() {
        return this.#congSuat
    }
}