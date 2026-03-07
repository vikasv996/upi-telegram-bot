import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    telegramId!: string;

    @Column()
    step!: string;

    @Column({nullable: true})
    upiId?: string;

    @Column({nullable: true})
    name?: string;

    @Column({nullable: true})
    amount?: string;

    @Column({nullable: true})
    note?: string;
}
