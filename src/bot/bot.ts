import "reflect-metadata";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import {AppDataSource} from "../database/data-source";
import {getSession, updateSession} from "../services/sessionService";
import {SessionStep} from "../utils/sessionSteps";
import {generateUPILink} from "../utils/upiGenerator";
import {generateQR} from "../utils/qrGenerator";
import {startServer} from "../server/server";
import {createPayment} from "../services/paymentService";

dotenv.config();

const token = process.env.TELEGRAM_TOKEN as string;

async function startBot() {
    const bot = new TelegramBot(token, { polling: true });

    bot.on("message", async (msg) => {
        const chatId = msg.chat.id;

        const text = msg.text?.trim().toLowerCase() || "";
        const telegramId = chatId.toString();

        const session = await getSession(telegramId);

        // START PAYMENT FLOW
        if (text === "/pay") {

            session.step = SessionStep.WAITING_ALIAS;
            await updateSession(session);

            bot.sendMessage(chatId, "Enter alias or type 'custom'");

            return;
        }

        // WAITING FOR ALIAS
        if (session.step === SessionStep.WAITING_ALIAS) {

            if (text === "custom") {

                session.step = SessionStep.WAITING_UPI;
                await updateSession(session);

                bot.sendMessage(chatId, "Enter UPI ID");

                return;
            }

            bot.sendMessage(chatId, "Alias feature coming next step 😉");

            return;
        }

        // WAITING FOR UPI
        if (session.step === SessionStep.WAITING_UPI) {

            session.upiId = text;
            session.step = SessionStep.WAITING_NAME;

            await updateSession(session);

            bot.sendMessage(chatId, "Enter recipient name");

            return;
        }

        // WAITING FOR NAME
        if (session.step === SessionStep.WAITING_NAME) {

            session.name = text;
            session.step = SessionStep.WAITING_AMOUNT;

            await updateSession(session);

            bot.sendMessage(chatId, "Enter amount");

            return;
        }

        // WAITING FOR AMOUNT
        if (session.step === SessionStep.WAITING_AMOUNT) {

            session.amount = text;
            session.step = SessionStep.WAITING_NOTE;

            await updateSession(session);

            bot.sendMessage(chatId, "Enter payment note");

            return;
        }

        // WAITING NOTE
        if (session.step === SessionStep.WAITING_NOTE) {

            session.note = text;

            const payment = await createPayment({
                upiId: session.upiId!,
                name: session.name!,
                amount: session.amount!,
                note: session.note
            });

            const paymentUrl = `https://upi-telegram-bot-production.up.railway.app/pay/${payment.id}`;
            const upiLink = generateUPILink(
                session.upiId!,
                session.name!,
                session.amount!,
                session.note
            );

            const qr = await generateQR(upiLink);
            await bot.sendMessage(
                chatId,
                `Payment Request
Name: ${session.name}
Amount: ₹${session.amount}
Pay here:
${paymentUrl}`,
            );
            await bot.sendPhoto(chatId, qr);
            session.step = SessionStep.IDLE;
            await updateSession(session);
            return;
        }
    });
}

AppDataSource.initialize().then(() => {
    console.log("Database Connected");

    startServer();
    startBot();
})
.catch(err => {
    console.error("Database connection failed", err);
})