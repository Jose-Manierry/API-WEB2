import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecoverPasswordToUsers1780113350492 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "recoverPassword",
            type: "varchar",
            isUnique: true,
            isNullable: true,
        }));

        await queryRunner.query(`ALTER TABLE users ADD CONSTRAINT recover_password_not_null CHECK (recoverPassword IS NOT NULL) AFTER email`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "recoverPassword");
    }

}
