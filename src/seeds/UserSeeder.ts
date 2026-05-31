import { AppDataSource } from "../data-source";
import { User } from "../entities/User";  
import bcrypt from "bcrypt";

export async function UserSeeder() {
    const userRepository = AppDataSource.getRepository(User);

    const users = [
        { name: "Mateus Castro", email: "mateus@email.com", password: await bcrypt.hash("123456", 10), situationId: 1 },
        { name: "Maria Santos", email: "maria@email.com", password: await bcrypt.hash("123456", 10), situationId: 2 },
        { name: "José Oliveira", email: "jose@email.com", password: await bcrypt.hash("123456", 10), situationId: 3 },
        { name: "Paula Costa", email: "paula@email.com", password: await bcrypt.hash("123456", 10), situationId: 4 },
        { name: "Suzana Vieira", email: "suzana@email.com", password: await bcrypt.hash("123456", 10), situationId: 5 }
    ];

    for (const data of users) {
        const exists = await userRepository.findOneBy({ name: data.name });
        if (!exists) {
            const user = userRepository.create(data);
            await userRepository.save(user);
            console.log(`Usuário '${data.name}' criado com sucesso.`);
        } else {
            console.log(`Usuário '${data.name}' já existe.`);
        }
    }
}
