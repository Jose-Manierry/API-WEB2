import { Router, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { verifyToken } from "../middlewares/authMiddleware";
import bcrypt from "bcryptjs";
import * as yup from "yup";
import { parse } from "path";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { PaginationService } from "../services/PaginationService";

const router = Router();

router.get("/users", verifyToken, async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate({ userRepository, page, limit, order: { id: "DESC" }, relations: ["situation"] });
        return res.json(result);
        return;
    } catch (error) {
        return res.status(500).json({ error: "Erro ao listar usuários." });
    }
});

router.get("/users/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const UserRepository = AppDataSource.getRepository(User);
        const user = await UserRepository.findOne({
            relations: ["situation"],
            where: { id: parseInt(id) }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar usuário." });
    }
});

router.post("/users", verifyToken, async (req: Request, res: Response) => {
    try {
        const schema = yup.object().shape({
            name: yup.string()
                .required("O nome é obrigatório.")
                .min(3, "O nome deve ter pelo menos 3 caracteres."),
            email: yup.string()
                .email("Formato de e-mail inválido.")
                .required("O e-mail é obrigatório.")
                .test("unique-email", "Este e-mail já está cadastrado.", async (value) => {
                    if (!value) return true;
                    const exists = await UserService.findByEmail(value);
                    return !exists;
                }),
            password: yup.string()
                .required("A senha é obrigatória.")
                .min(6, "A senha deve ter pelo menos 6 caracteres."),
            situationId: yup.number()
                .required("A situação é obrigatória.")
        });

        const data = req.body;

        // Valida os dados ANTES de criptografar (para validar a senha real)
        await schema.validate(data, { abortEarly: false });

        // Criptografia com 10 rounds conforme solicitado
        //data.password = await bcrypt.hash(data.password, 10);

        const user = await UserService.create(data);
        return res.status(201).json(user);
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ type: "ValidationError", messages: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar usuário." });
    }
});

router.put("/users-password/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data = req.body;

        const schema = yup.object().shape({
            name: yup.string()
                .min(3, "O nome deve ter pelo menos 3 caracteres."),
            email: yup.string()
                .email("Formato de e-mail inválido.")
                .test("unique-email-update", "Este e-mail já está em uso por outro usuário.", async (value) => {
                    if (!value) return true;
                    const exists = await UserService.findByEmail(value);
                    return !exists || (exists as { id: number }).id === Number(id);
                }),
            password: yup.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
            situationId: yup.number()
        });

        await schema.validate(req.body, { abortEarly: false });

        const { name, email, password, situationId } = req.body;
        const updateData: any = { name, email, situationId };

        if (password) {
            // Atualizado para 10 rounds para manter a consistência do modelo
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await UserService.update(Number(id), updateData);

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        return res.json(user);
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ type: "ValidationError", messages: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
});

router.delete("/users/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await UserService.delete(Number(id));

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        return res.json({ message: "Usuário deletado com sucesso." });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao deletar usuário." });
    }
});

export default router;