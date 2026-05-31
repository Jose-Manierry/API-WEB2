import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entities/ProductCategory";

export async function ProductCategorySeeder() {
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

    const categories = [
        { name: "Eletrôdomesticos" },
        { name: "Calçados" },
        { name: "Mercearia" },
        { name: "Móveis" }
    ];

    for (const data of categories) {
        const exists = await productCategoryRepository.findOneBy({ name: data.name });
        if (!exists) {
            const category = productCategoryRepository.create(data);
            await productCategoryRepository.save(category);
            console.log(`Categoria '${data.name}' criada com sucesso.`);
        } else {
            console.log(`Categoria '${data.name}' já existe.`);
        }
    }
}
