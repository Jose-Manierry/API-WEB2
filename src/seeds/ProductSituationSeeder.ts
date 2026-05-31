import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entities/ProductSituation";

export async function ProductSituationSeeder() {
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);

    const situations = [
        { name: "Disponível" },
        { name: "Indisponível" },
        { name: "Promoção" }
    ];

    for (const data of situations) {
        const exists = await productSituationRepository.findOneBy({ name: data.name });
        if (!exists) {
            const situation = productSituationRepository.create(data);
            await productSituationRepository.save(situation);
            console.log(`Situação de produto '${data.name}' criada com sucesso.`);
        } else {
            console.log(`Situação de produto '${data.name}' já existe.`);
        }
    }
}
