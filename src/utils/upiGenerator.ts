export function generateUPILink(
    upiId: string,
    name: string,
    amount: string,
    note?: string
): string {

    const params = new URLSearchParams({
        pa: upiId,
        pn: name,
        am: amount,
        cu: "INR",
        tn: note || "Payment"
    });

    return `upi://pay?${params.toString()}`;
}
