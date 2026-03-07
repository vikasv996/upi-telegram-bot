"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = getSession;
exports.updateSession = updateSession;
exports.clearSession = clearSession;
const data_source_1 = require("../database/data-source");
const Session_1 = require("../entities/Session");
const sessionRepo = data_source_1.AppDataSource.getRepository(Session_1.Session);
async function getSession(telegramId) {
    let session = await sessionRepo.findOne({
        where: { telegramId }
    });
    if (!session) {
        session = sessionRepo.create({
            telegramId,
            step: "IDLE"
        });
        await sessionRepo.save(session);
    }
    return session;
}
async function updateSession(session) {
    return sessionRepo.save(session);
}
async function clearSession(telegramId) {
    const session = await getSession(telegramId);
    session.step = "IDLE";
    session.upiId = undefined;
    session.name = undefined;
    session.amount = undefined;
    session.note = undefined;
    await sessionRepo.save(session);
}
