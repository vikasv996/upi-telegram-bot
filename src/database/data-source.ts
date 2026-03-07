import "reflect-metadata";
import { DataSource } from "typeorm";
import { Alias } from "../entities/Alias";
import { Session } from "../entities/Session";
import { User } from "../entities/User";
import {Payment} from "../entities/Payment";

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',

    synchronize: true,
    logging: false,
    entities: [Alias, Session, User, Payment],
})
