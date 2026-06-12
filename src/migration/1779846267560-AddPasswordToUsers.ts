import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPasswordToUsers1779846267560 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("users");
        const passwordColumn = table?.findColumnByName("password");

        if (!passwordColumn) {
            await queryRunner.addColumn("users", new TableColumn({
                name: "password",
                type: "varchar",
                isNullable: false,
            }));
        }
    }

    
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "password");
    }
    
}
