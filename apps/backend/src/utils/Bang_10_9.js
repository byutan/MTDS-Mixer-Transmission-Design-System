export const BANG_10_9 = {
    toi_dong_dien_tan_so_cao: [
        {
            sigmaBLoiMin: 600,
            sigmaBLoiMax: 800,
            trucNhan: [1.5, 1.7],
            tapTrungUngSuatIt: [1.6, 1.7],
            tapTrungUngSuatNhieu: [2.4, 2.8],
        },
        {
            sigmaBLoiMin: 800,
            sigmaBLoiMax: 1000,
            trucNhan: [1.3, 1.5],
            tapTrungUngSuatIt: [1.6, 1.7],
            tapTrungUngSuatNhieu: null,
        },
    ],
    tham_nito: [
        {
            sigmaBLoiMin: 900,
            sigmaBLoiMax: 1200,
            trucNhan: [1.1, 1.25],
            tapTrungUngSuatIt: [1.5, 1.7],
            tapTrungUngSuatNhieu: [1.7, 2.1],
        },
    ],
    tham_cacbon: [
        {
            sigmaBLoiMin: 400,
            sigmaBLoiMax: 600,
            trucNhan: [1.8, 2.0],
            tapTrungUngSuatIt: 3,
            tapTrungUngSuatNhieu: null,
        },
        {
            sigmaBLoiMin: 700,
            sigmaBLoiMax: 800,
            trucNhan: [1.4, 1.5],
            tapTrungUngSuatIt: null,
            tapTrungUngSuatNhieu: null,
        },
        {
            sigmaBLoiMin: 1000,
            sigmaBLoiMax: 2000,
            trucNhan: [1.2, 1.3],
            tapTrungUngSuatIt: 2,
            tapTrungUngSuatNhieu: null,
        },
    ],
    phun_bi: [
        {
            sigmaBLoiMin: 600,
            sigmaBLoiMax: 1500,
            trucNhan: [1.1, 1.25],
            tapTrungUngSuatIt: [1.5, 1.6],
            tapTrungUngSuatNhieu: [1.7, 2.1],
        },
    ],
    lan_nen: [
        {
            sigmaBLoiMin: null,
            sigmaBLoiMax: null,
            trucNhan: [1.2, 1.3],
            tapTrungUngSuatIt: [1.5, 1.6],
            tapTrungUngSuatNhieu: [1.8, 2.0],
        },
    ],
};

const chonGiaTriTuKhoang = (giaTri, cachChon = "trung_binh") => {
    if (giaTri == null) {
        return null;
    }

    if (typeof giaTri === "number") {
        return giaTri;
    }

    if (!Array.isArray(giaTri) || giaTri.length !== 2) {
        throw new Error("Gia tri bang 10.9 khong hop le.");
    }

    const [min, max] = giaTri;

    if (cachChon === "min") {
        return min;
    }

    if (cachChon === "max") {
        return max;
    }

    return Number(((min + max) / 2).toFixed(3));
};

export const traKy = ({
    phuongPhapTangBenBeMat,
    sigmaBLoi,
    nhomTruc = "trucNhan",
    cachChon = "trung_binh",
}) => {
    const bangTheoPhuongPhap = BANG_10_9[phuongPhapTangBenBeMat];

    if (!bangTheoPhuongPhap) {
        throw new Error(
            `Khong ton tai phuong phap tang ben be mat '${phuongPhapTangBenBeMat}' trong bang 10.9.`
        );
    }

    const dong =
        bangTheoPhuongPhap.find((item) => {
            if (item.sigmaBLoiMin == null && item.sigmaBLoiMax == null) {
                return true;
            }

            return sigmaBLoi >= item.sigmaBLoiMin && sigmaBLoi <= item.sigmaBLoiMax;
        }) ?? bangTheoPhuongPhap[bangTheoPhuongPhap.length - 1];

    const giaTri = chonGiaTriTuKhoang(dong[nhomTruc], cachChon);

    if (giaTri == null) {
        throw new Error(
            `Khong co gia tri Ky phu hop cho nhom truc '${nhomTruc}' trong bang 10.9.`
        );
    }

    return giaTri;
};
