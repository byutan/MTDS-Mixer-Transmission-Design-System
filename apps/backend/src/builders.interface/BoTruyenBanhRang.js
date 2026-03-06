import { BoTruyen } from "./BoTruyen.interface.js"

export class BoTruyenBanhRang extends BoTruyen {
    /**
    * @param {{ 
    * hieuSuat?: number, 
    * capChinhXac?: number, 
    * cheKin?: boolean 
    * }} params
    */
    #hieuSuat
    #capChinhXac
    #cheKin
    constructor({hieuSuat, capChinhXac, cheKin }) {
        super()
        this.#hieuSuat = hieuSuat
        this.#capChinhXac = capChinhXac
        this.#cheKin = cheKin
    }
    getHieuSuat() {
        return this.#hieuSuat;
    }

    getCapChinhXac() {
        return this.#capChinhXac;
    }
    
    isCheKin() { 
        return this.#cheKin;
    }
}   