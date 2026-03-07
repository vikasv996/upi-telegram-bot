import { AppDataSource } from "../database/data-source";
import { Payment } from "../entities/Payment";

const paymentRepo = AppDataSource.getRepository(Payment);

export async function createPayment(data: {
    upiId: string;
    name: string;
    amount: string;
    note?: string;
}) {
    const payment = paymentRepo.create(data);
    return paymentRepo.save(payment);
}

export async function getPayment(id: number) {

    return paymentRepo.findOne({
        where: { id }
    });
}