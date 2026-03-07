import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Alias {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    alias!: string;

    @Column()
    upiId!: string;

    @Column()
    name!: string;
}
