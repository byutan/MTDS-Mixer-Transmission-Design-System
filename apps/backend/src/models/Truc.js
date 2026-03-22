export class Truc {
    #tenTruc
    #congSuat
    #tySoTruyen
    #soVongQuay
    #momentXoan
    /**
     * @param {{ 
     * tenTruc: string, 
     * congSuat: number, 
     * tySoTruyen: number | null, 
     * soVongQuay: number, 
     * momentXoan: number 
     * }} params
     */
    constructor({ tenTruc, congSuat, tySoTruyen, soVongQuay, momentXoan }) {
        this.#tenTruc = tenTruc;
        this.#congSuat = congSuat;
        this.#tySoTruyen = tySoTruyen; 
        this.#soVongQuay = soVongQuay; 
        this.#momentXoan = momentXoan; 
    }
    getTenTruc() {
        return this.#tenTruc
    }
}
