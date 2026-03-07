import { AppDataSource } from "../database/data-source";
import { Session } from "../entities/Session";

const sessionRepo = AppDataSource.getRepository(Session);

export async function getSession(telegramId: string): Promise<Session> {

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

export async function updateSession(session: Session) {
    return sessionRepo.save(session);
}

export async function clearSession(telegramId: string) {

    const session = await getSession(telegramId);

    session.step = "IDLE";
    session.upiId = undefined;
    session.name = undefined;
    session.amount = undefined;
    session.note = undefined;

    await sessionRepo.save(session);
}