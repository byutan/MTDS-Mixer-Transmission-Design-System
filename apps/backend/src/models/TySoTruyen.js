export class TySoTruyen {
    /*
    u: Tỷ số truyền tổng của toàn hệ thống (u = u_d * u_h)
    ud: Tỷ số truyền của bộ truyền đai
    uh: Tỷ số truyền chung của hộp giảm tốc (u_h = u1 * u2)
    u1: Tỷ số truyền cấp bánh răng côn
    u2: Tỷ số truyền cấp bánh răng trụ 
    */
    constructor(u_tong, u_dai, u_hop, u_con, u_tru) {
        this.u_tong = u_tong
        this.u_dai = u_dai
        this.u_hop = u_hop
        this.u_con = u_con
        this.u_tru = u_tru
    }
}