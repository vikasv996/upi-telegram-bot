"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("../database/data-source");
const sessionService_1 = require("../services/sessionService");
const sessionSteps_1 = require("../utils/sessionSteps");
const upiGenerator_1 = require("../utils/upiGenerator");
const qrGenerator_1 = require("../utils/qrGenerator");
const server_1 = require("../server/server");
const paymentService_1 = require("../services/paymentService");
dotenv_1.default.config();
const token = process.env.TELEGRAM_TOKEN;
async function startBot() {
    const bot = new node_telegram_bot_api_1.default(token, { polling: true });
    bot.on("message", async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text?.trim().toLowerCase() || "";
        const telegramId = chatId.toString();
        const session = await (0, sessionService_1.getSession)(telegramId);
        // START PAYMENT FLOW
        if (text === "/pay") {
            session.step = sessionSteps_1.SessionStep.WAITING_ALIAS;
            await (0, sessionService_1.updateSession)(session);
            bot.sendMessage(chatId, "Enter alias or type 'custom'");
            return;
        }
        // WAITING FOR ALIAS
        if (session.step === sessionSteps_1.SessionStep.WAITING_ALIAS) {
            if (text === "custom") {
                session.step = sessionSteps_1.SessionStep.WAITING_UPI;
                await (0, sessionService_1.updateSession)(session);
                bot.sendMessage(chatId, "Enter UPI ID");
                return;
            }
            bot.sendMessage(chatId, "Alias feature coming next step 😉");
            return;
        }
        // WAITING FOR UPI
        if (session.step === sessionSteps_1.SessionStep.WAITING_UPI) {
            session.upiId = text;
            session.step = sessionSteps_1.SessionStep.WAITING_NAME;
            await (0, sessionService_1.updateSession)(session);
            bot.sendMessage(chatId, "Enter recipient name");
            return;
        }
        // WAITING FOR NAME
        if (session.step === sessionSteps_1.SessionStep.WAITING_NAME) {
            session.name = text;
            session.step = sessionSteps_1.SessionStep.WAITING_AMOUNT;
            await (0, sessionService_1.updateSession)(session);
            bot.sendMessage(chatId, "Enter amount");
            return;
        }
        // WAITING FOR AMOUNT
        if (session.step === sessionSteps_1.SessionStep.WAITING_AMOUNT) {
            session.amount = text;
            session.step = sessionSteps_1.SessionStep.WAITING_NOTE;
            await (0, sessionService_1.updateSession)(session);
            bot.sendMessage(chatId, "Enter payment note");
            return;
        }
        // WAITING NOTE
        if (session.step === sessionSteps_1.SessionStep.WAITING_NOTE) {
            session.note = text;
            const payment = await (0, paymentService_1.createPayment)({
                upiId: session.upiId,
                name: session.name,
                amount: session.amount,
                note: session.note
            });
            const paymentUrl = `https://upi-telegram-bot-production.up.railway.app/pay/${payment.id}`;
            const upiLink = (0, upiGenerator_1.generateUPILink)(session.upiId, session.name, session.amount, session.note);
            const qr = await (0, qrGenerator_1.generateQR)(upiLink);
            await bot.sendMessage(chatId, `Payment Request
Name: ${session.name}
Amount: ₹${session.amount}
Pay here:
${paymentUrl}`);
            await bot.sendPhoto(chatId, qr);
            session.step = sessionSteps_1.SessionStep.IDLE;
            await (0, sessionService_1.updateSession)(session);
            return;
        }
    });
}
data_source_1.AppDataSource.initialize().then(() => {
    console.log("Database Connected");
    (0, server_1.startServer)();
    startBot();
})
    .catch(err => {
    console.error("Database connection failed", err);
});
