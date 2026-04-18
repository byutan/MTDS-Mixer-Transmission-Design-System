import { BanhRangCon } from "../models/BanhRangCon.js";

export const tinhToanHinhHoc = (duLieuDauVao) => {
    // Khởi tạo đối tượng Bánh Răng Côn với các thông số mặc định (Hiệu suất, cấp chính xác...)
    const banhRangCon = new BanhRangCon(duLieuDauVao.caiDatBanhRang || {});
    
    // Gọi method tính toán hình học từ Model
    return banhRangCon.tinhToanThongSoHinhHoc(duLieuDauVao);
};