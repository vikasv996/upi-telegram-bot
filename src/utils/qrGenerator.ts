import QRCode from "qrcode";

export async function generateQR(link: string) {
    const buffer = await QRCode.toBuffer(link);
    return buffer;
}
