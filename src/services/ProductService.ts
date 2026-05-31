import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

const productRepository = AppDataSource.getRepository(Product);

interface PaginationParams {
    page: number;
    limit: number;
}

export class ProductService {

    static async findAll({ page, limit }: PaginationParams) {
        const skip = (page - 1) * limit;

        const [products, total] = await productRepository.findAndCount({
            skip,
            take: limit,
            order: { id: "ASC" },
            relations: ["productSituation", "productCategory"]
        });

        return {
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    static async findById(id: number) {
        return await productRepository.findOne({
            where: { id },
            relations: ["productSituation", "productCategory"]
        });
    }

    static async create(data: Partial<Product>) {
        const product = productRepository.create(data);
        return await productRepository.save(product);
    }

    static async update(id: number, data: Partial<Product>) {
        const product = await productRepository.findOneBy({ id });
        if (!product) return null;

        productRepository.merge(product, data);
        return await productRepository.save(product);
    }

    static async delete(id: number) {
        const product = await productRepository.findOneBy({ id });
        if (!product) return null;

        await productRepository.remove(product);
        return product;
    }
}
