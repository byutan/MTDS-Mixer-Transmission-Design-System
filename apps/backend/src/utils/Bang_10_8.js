const CAC_MOC_SIGMA_B = [400, 600, 800, 1200];

export const BANG_10_8 = {
    mai_ra_032_016: {
        nhan: "Mai Ra 0.32...0.16",
        giaTri: [1, 1, 1, 1],
    },
    tien_ra_25_063: {
        nhan: "Tien Ra 2.5...0.63",
        giaTri: [1.05, 1.06, 1.1, 1.25],
    },
    tien_tho_rz_80_20: {
        nhan: "Tien tho Rz 80...20",
        giaTri: [1.2, 1.2, 1.25, 1.5],
    },
    be_mat_khong_gia_cong: {
        nhan: "Be mat khong gia cong",
        giaTri: [1.3, 1.35, 1.5, 2.2],
    },
};

const timCotGanNhat = (sigmaB) => {
    return CAC_MOC_SIGMA_B.reduce((ganNhat, mocHienTai) =>
        Math.abs(mocHienTai - sigmaB) < Math.abs(ganNhat - sigmaB) ? mocHienTai : ganNhat
    );
};

export const traKx = (phuongPhapGiaCong, sigmaB) => {
    const dong = BANG_10_8[phuongPhapGiaCong];

    if (!dong) {
        throw new Error(`Khong ton tai phuong phap gia cong '${phuongPhapGiaCong}' trong bang 10.8.`);
    }

    if (typeof sigmaB !== "number" || sigmaB <= 0) {
        throw new Error("sigmaB phai la so duong.");
    }

    const mocGanNhat = timCotGanNhat(sigmaB);
    const chiSoCot = CAC_MOC_SIGMA_B.indexOf(mocGanNhat);

    return dong.giaTri[chiSoCot];
};
