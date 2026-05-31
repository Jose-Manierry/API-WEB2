import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

interface UserCreateData {
    name: string;
    email: string;
    situationId: number;
}

export class UserService {
    static async findAll({ page, limit }: { page: number; limit: number }) {
        const userRepository = AppDataSource.getRepository(User);
        const [users, total] = await userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: ["situation"]
        });

        return {
            data: users,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    static async findById(id: number) {
        const userRepository = AppDataSource.getRepository(User);
        return await userRepository.findOne({ 
            where: { id },
            relations: ["situation"]
        });
    }

    static async create(data: UserCreateData) {
        const userRepository = AppDataSource.getRepository(User);
        const user = userRepository.create(data);
        return await userRepository.save(user);
    }

    static async update(id: number, data: Partial<UserCreateData>) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });
        if (!user) return null;
        userRepository.merge(user, data);
        return await userRepository.save(user);
    }

    static async delete(id: number) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });
        if (!user) return null;
        return await userRepository.remove(user);
    }
}