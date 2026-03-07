import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    upiId!: string;

    @Column()
    name!: string;

    @Column()
    amount!: string;

    @Column({ nullable: true })
    note?: string;

    @CreateDateColumn()
    createdAt!: Date;
}
