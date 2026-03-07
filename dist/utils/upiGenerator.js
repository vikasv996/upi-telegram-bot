"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUPILink = generateUPILink;
function generateUPILink(upiId, name, amount, note) {
    const params = new URLSearchParams({
        pa: upiId,
        pn: name,
        am: amount,
        cu: "INR",
        tn: note || "Payment"
    });
    return `upi://pay?${params.toString()}`;
}
