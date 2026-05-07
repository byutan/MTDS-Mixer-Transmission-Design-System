const CAC_MOC_DUONG_KINH = [15, 20, 30, 40, 50, 70, 80, 100];

export const BANG_10_10 = {
    uon: {
        thep_carbon: [0.95, 0.92, 0.88, 0.85, 0.81, 0.76, 0.73, 0.7],
        thep_hop_kim: [0.87, 0.83, 0.77, 0.73, 0.7, 0.66, 0.64, 0.62],
    },
    xoan: {
        thep_chung: [0.92, 0.89, 0.81, 0.78, 0.76, 0.73, 0.71, 0.7],
    },
};

const noiSuyTuyenTinh = (x, x1, y1, x2, y2) => {
    if (x1 === x2) {
        return y1;
    }

    return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
};

const traGiaTriTheoDuongKinh = (duongKinh, dayGiaTri) => {
    if (duongKinh <= CAC_MOC_DUONG_KINH[0]) {
        return dayGiaTri[0];
    }

    if (duongKinh >= CAC_MOC_DUONG_KINH[CAC_MOC_DUONG_KINH.length - 1]) {
        return dayGiaTri[dayGiaTri.length - 1];
    }

    for (let i = 0; i < CAC_MOC_DUONG_KINH.length - 1; i += 1) {
        const x1 = CAC_MOC_DUONG_KINH[i];
        const x2 = CAC_MOC_DUONG_KINH[i + 1];

        if (duongKinh >= x1 && duongKinh <= x2) {
            return noiSuyTuyenTinh(duongKinh, x1, dayGiaTri[i], x2, dayGiaTri[i + 1]);
        }
    }

    return dayGiaTri[dayGiaTri.length - 1];
};

export const traEpsilonSigma = (duongKinh, loaiVatLieu = "thep_carbon") => {
    const dayGiaTri = BANG_10_10.uon[loaiVatLieu];

    if (!dayGiaTri) {
        throw new Error(`Khong ton tai loai vat lieu '${loaiVatLieu}' trong bang 10.10.`);
    }

    return traGiaTriTheoDuongKinh(duongKinh, dayGiaTri);
};

export const traEpsilonTau = (duongKinh) => {
    return traGiaTriTheoDuongKinh(duongKinh, BANG_10_10.xoan.thep_chung);
};
