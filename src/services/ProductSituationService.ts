import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entities/ProductSituation";

const productSituationRepository = AppDataSource.getRepository(ProductSituation);

interface PaginationParams {
    page: number;
    limit: number;
}

export class ProductSituationService {

    static async findAll({ page, limit }: PaginationParams) {
        const skip = (page - 1) * limit;

        const [productSituations, total] = await productSituationRepository.findAndCount({
            skip,
            take: limit,
            order: { id: "ASC" }
        });

        return {
            productSituations,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    static async findById(id: number) {
        return await productSituationRepository.findOne({
            where: { id },
            relations: ["products"]
        });
    }

    static async create(data: Partial<ProductSituation>) {
        const productSituation = productSituationRepository.create(data);
        return await productSituationRepository.save(productSituation);
    }

    static async update(id: number, data: Partial<ProductSituation>) {
        const productSituation = await productSituationRepository.findOneBy({ id });
        if (!productSituation) return null;

        productSituationRepository.merge(productSituation, data);
        return await productSituationRepository.save(productSituation);
    }

    static async delete(id: number) {
        const productSituation = await productSituationRepository.findOneBy({ id });
        if (!productSituation) return null;

        await productSituationRepository.remove(productSituation);
        return productSituation;
    }
}
