"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const paymentService_1 = require("../services/paymentService");
const upiGenerator_1 = require("../utils/upiGenerator");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get("/pay/:id", async (req, res) => {
    const id = Number(req.params.id);
    const payment = await (0, paymentService_1.getPayment)(id);
    if (!payment) {
        return res.status(404).send("Payment not found");
    }
    const upiLink = (0, upiGenerator_1.generateUPILink)(payment.upiId, payment.name, payment.amount, payment.note);
    res.redirect(upiLink);
});
function startServer() {
    app.listen(PORT, () => {
        console.log(`Redirect server running on port ${PORT}`);
    });
}
