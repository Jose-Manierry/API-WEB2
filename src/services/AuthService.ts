import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    /**
     * método para autenticar um usuário com base no email e senha fornecidos
     * @param email - o email do usuário a ser autenticado
     * @param password - a senha do usuário a ser autenticado
     * @returns um objeto contendo os dados do usuário autenticado ou null se a autenticação falhar
     * @throws Error - lança um erro se ocorrer um problema durante a autenticação
    */
   async login(email: string, password: string): Promise<{ id: number, name: string, email: string, token: string }> {
   
    const user = await this.userRepository.findOne({where: {email }})
    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error("Senha inválida.");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    return { id: user.id, name: user.name, email: user.email, token };
    }

}
    