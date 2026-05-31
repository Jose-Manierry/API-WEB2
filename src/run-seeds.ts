import { AppDataSource } from "./data-source";
import { SituationSeeder } from "./seeds/SituationSeeder";
import { ProductCategorySeeder } from "./seeds/ProductCategorySeeder";
import { ProductSituationSeeder } from "./seeds/ProductSituationSeeder";
import { UserSeeder } from "./seeds/UserSeeder";
import { ProductSeeder } from "./seeds/ProductSeeder";

async function runSeeds() {
    try {
        await AppDataSource.initialize();
        console.log("Conexão com o banco de dados estabelecida.");

        console.log("\n--- Executando Seeds ---\n");

        await SituationSeeder();
        await ProductCategorySeeder();
        await ProductSituationSeeder();
        await UserSeeder();
        await ProductSeeder();

        console.log("\n--- Seeds executadas com sucesso! ---\n");
    } catch (error) {
        console.error("Erro ao executar seeds:", error);
    } finally {
        await AppDataSource.destroy();
        process.exit(0);
    }
}

runSeeds();
