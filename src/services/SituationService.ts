import { AppDataSource } from "../data-source";
import { Situation } from "../entities/Situation";

const situationRepository = AppDataSource.getRepository(Situation);

interface PaginationParams {
    page: number;
    limit: number;
}

export class SituationService {

    static async findAll({ page, limit }: PaginationParams) {
        const skip = (page - 1) * limit;

        const [situations, total] = await situationRepository.findAndCount({
            skip,
            take: limit,
            order: { id: "ASC" }
        });

        return {
            situations,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    static async findByNameSituation(value: string) {
        return await situationRepository.findOne({
            where: { nameSituation: value }
        });
    }

    static async findById(id: number) {
        return await situationRepository.findOne({
            where: { id },
            relations: ["users"]
        });
    }

    static async create(data: Partial<Situation>) {
        const situation = situationRepository.create(data);
        return await situationRepository.save(situation);
    }

    static async update(id: number, data: Partial<Situation>) {
        const situation = await situationRepository.findOneBy({ id });
        if (!situation) return null;

        situationRepository.merge(situation, data);
        return await situationRepository.save(situation);
    }

    static async delete(id: number) {
        const situation = await situationRepository.findOneBy({ id });
        if (!situation) return null;

        await situationRepository.remove(situation);
        return situation;
    }
}
