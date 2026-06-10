import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entities/ProductCategory";

const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

interface PaginationParams {
    page: number;
    limit: number;
}

export class ProductCategoryService {

    static async findAll({ page, limit }: PaginationParams) {
        const skip = (page - 1) * limit;

        const [productCategories, total] = await productCategoryRepository.findAndCount({
            skip,
            take: limit,
            order: { id: "ASC" }
        });

        return {
            productCategories,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    static async findByName(value: string) {
        return await productCategoryRepository.findOne({
            where: { name: value }
        });
    }

    static async findById(id: number) {
        return await productCategoryRepository.findOne({
            where: { id },
            relations: ["products"]
        });
    }

    static async create(data: Partial<ProductCategory>) {
        const productCategory = productCategoryRepository.create(data);
        return await productCategoryRepository.save(productCategory);
    }

    static async update(id: number, data: Partial<ProductCategory>) {
        const productCategory = await productCategoryRepository.findOneBy({ id });
        if (!productCategory) return null;

        productCategoryRepository.merge(productCategory, data);
        return await productCategoryRepository.save(productCategory);
    }

    static async delete(id: number) {
        const productCategory = await productCategoryRepository.findOneBy({ id });
        if (!productCategory) return null;

        await productCategoryRepository.remove(productCategory);
        return productCategory;
    }
}
