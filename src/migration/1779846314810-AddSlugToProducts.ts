import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSlugToProducts1779846314810 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("products", new TableColumn({
            name: "slug",
            type: "varchar",
            length: "255",
            isNullable: true,
            isUnique: true
        }));

        await queryRunner.query(`ALTER TABLE products ADD CONSTRAINT slug_unique UNIQUE (slug)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "slug");
    }

}
