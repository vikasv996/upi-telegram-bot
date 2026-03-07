"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = createPayment;
exports.getPayment = getPayment;
const data_source_1 = require("../database/data-source");
const Payment_1 = require("../entities/Payment");
const paymentRepo = data_source_1.AppDataSource.getRepository(Payment_1.Payment);
async function createPayment(data) {
    const payment = paymentRepo.create(data);
    return paymentRepo.save(payment);
}
async function getPayment(id) {
    return paymentRepo.findOne({
        where: { id }
    });
}
