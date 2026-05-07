import { BanhRangCon } from "../models/BanhRangCon.js";
import { tinhBangDacTinhKyThuat } from "./HeThongTruyenDong.services.js";

export const tinhToanHinhHoc = (duLieuDauVao) => {
    // 1. Gọi hàm tính động học của nhóm
    const bangDacTinh = tinhBangDacTinhKyThuat(duLieuDauVao);

    // 2. Dùng lệnh find() để tìm đúng Trục I và Trục II trong mảng
    let trucI = bangDacTinh.find(item => item.truc === 'I');
    let trucII = bangDacTinh.find(item => item.truc === 'II');

    if (!trucI) trucI = { momentXoan: 1, soVongQuay: 1 };
    if (!trucII) trucII = { momentXoan: 1, soVongQuay: 1 };

    // 3. Rút T1, n1, u theo đúng tên biến của team bạn (momentXoan, soVongQuay)
    const T1_da_tinh = trucI.momentXoan || 1;
    const n1_da_tinh = trucI.soVongQuay || 1;
    const u_banh_rang = (trucI.soVongQuay || 1) / (trucII.soVongQuay || 1);

    // 4. Lấy hệ số K_be từ JSON gốc
    const heSoKbe = duLieuDauVao?.heThongTruyenDong?.hopGiamToc?.heSoThietKe?.K_be || 0.285;

    // 5. Chuẩn bị data cho Model
    const dataBanhRang = {
        T1: T1_da_tinh,
        n1: n1_da_tinh,
        u: u_banh_rang,
        Kbe: heSoKbe
    };

    // 6. Đẩy vào Model Bánh Răng Côn tính toán và trả kết quả thẳng ra Postman
    const banhRangCon = new BanhRangCon();
    return banhRangCon.tinhToanThongSoHinhHoc(dataBanhRang);
};