import {CapBanhRangCon} from './CapBanhRangCon.js'
import {CapBanhRangTru} from './CapBanhRangTru.js'
export class HopGiamToc {
    /*
    capBanhRangCon: Bánh răng côn
    capBanhRangTru: Bánh răng trụ
    */
    constructor(capBanhRangCon, capBanhRangTru) {
        if (capBanhRangCon instanceof CapBanhRangCon 
        && capBanhRangTru instanceof CapBanhRangTru)
            {this.capBanhRangCon = capBanhRangCon
            this.capBanhRangTru = capBanhRangTru
        }
    }
}