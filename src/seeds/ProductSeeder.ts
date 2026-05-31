import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

export async function ProductSeeder() {
    const productRepository = AppDataSource.getRepository(Product);

    const products = [
        { name: "Computador", productSituationId: 1, productCategoryId: 1 },
        { name: "Calça", productSituationId: 1, productCategoryId: 2 },
        { name: "Macarrão", productSituationId: 1, productCategoryId: 3 },
        { name: "Sofá", productSituationId: 3, productCategoryId: 4 },
        { name: "Celulares", productSituationId: 1, productCategoryId: 1 },
        { name: "Tênis", productSituationId: 2, productCategoryId: 2 }
    ];

    for (const data of products) {
        const exists = await productRepository.findOneBy({ name: data.name });
        if (!exists) {
            const product = productRepository.create(data);
            await productRepository.save(product);
            console.log(`Produto '${data.name}' criado com sucesso.`);
        } else {
            console.log(`Produto '${data.name}' já existe.`);
        }
    }
}
