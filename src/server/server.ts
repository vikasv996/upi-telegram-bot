import express from "express";
import dotenv from "dotenv";
import {getPayment} from "../services/paymentService";
import {generateUPILink} from "../utils/upiGenerator";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/pay/:id", async (req, res) => {

    const id = Number(req.params.id);
    const payment = await getPayment(id);

    if (!payment) {
        return res.status(404).send("Payment not found");
    }

    const upiLink = generateUPILink(
        payment.upiId,
        payment.name,
        payment.amount,
        payment.note
    );

    res.redirect(upiLink);
});

export function startServer() {
    app.listen(PORT, () => {
        console.log(`Redirect server running on port ${PORT}`);
    });
}