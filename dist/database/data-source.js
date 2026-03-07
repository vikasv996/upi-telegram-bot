"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Alias_1 = require("../entities/Alias");
const Session_1 = require("../entities/Session");
const User_1 = require("../entities/User");
const Payment_1 = require("../entities/Payment");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: false,
    entities: [Alias_1.Alias, Session_1.Session, User_1.User, Payment_1.Payment],
});
