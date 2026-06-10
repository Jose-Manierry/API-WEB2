import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPasswordToUsers1779846267560 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "password",
            type: "varchar",
            isNullable: false,
        }));

        await queryRunner.query(`ALTER TABLE users ADD CONSTRAINT password_not_null CHECK (password IS NOT NULL) AFTER email`);
    }

    
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "password");
    }
    
}
