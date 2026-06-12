import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { Situation } from "./Situation";
import bcrypt from "bcryptjs";

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ type: "varchar", length: 255, unique: true, nullable: true, default: null })
    recoverPassword!: string | null;

    @Column()
    situationId!: number;

    @ManyToOne(() => Situation, (situation) => situation.users)
    @JoinColumn({ name: "situationId" })
    situation!: Situation;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password && !this.password.startsWith("$2")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}