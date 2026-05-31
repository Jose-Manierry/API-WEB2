import { Request, Response } from "express";
import { ProductSituationService } from "../services/ProductSituationService";
import * as yup from "yup";

export class ProductSituationController {

    static async index(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await ProductSituationService.findAll({ page, limit });
            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar situações de produtos." });
        }
    }

    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const productSituation = await ProductSituationService.findById(Number(id));

            if (!productSituation) {
                return res.status(404).json({ error: "Situação de produto não encontrada." });
            }

            return res.json(productSituation);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar situação de produto." });
        }
    }

    static async store(req: Request, res: Response) {
        try {
            const schema = yup.object().shape({
                name: yup.string()
                    .required("O nome da situação do produto é obrigatório.")
                    .min(3, "O nome deve ser mais descritivo (mínimo de 3 caracteres).")
                    .trim()
                    .test("unique-name", "Esta situação de produto já está cadastrada no sistema.", async (value) => {
                        if (!value) return true;
                        const exists = await ProductSituationService.findByName(value);
                        // Retorna true se NÃO existir (validação passa)
                        return !exists; 
                    })
            });

            await schema.validate(req.body, { abortEarly: false });

            const { name } = req.body;
            const productSituation = await ProductSituationService.create({ name });
            return res.status(201).json(productSituation);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({ type: "ValidationError", messages: error.errors });
            }
            return res.status(500).json({ error: "Erro ao criar situação de produto." });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const schema = yup.object().shape({
                name: yup.string()
                    .required("O nome da situação do produto não pode ser vazio na atualização.")
                    .min(3, "O novo nome deve conter ao menos 3 caracteres.")
                    .trim()
                    .test("unique-name-update", "Este nome já pertence a outra situação de produto.", async (value) => {
                        if (!value) return true;
                        const exists = await ProductSituationService.findByName(value);
                        return !exists || (exists as { id: number }).id === Number(id);
                    })
            });

            await schema.validate(req.body, { abortEarly: false });

            const { name } = req.body;
            const productSituation = await ProductSituationService.update(Number(id), { name });

            if (!productSituation) {
                return res.status(404).json({ error: "Situação de produto não encontrada." });
            }
            return res.json(productSituation);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({ type: "ValidationError", messages: error.errors });
            }
            return res.status(500).json({ error: "Erro ao atualizar situação de produto." });
        }
    }

    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const productSituation = await ProductSituationService.delete(Number(id));

            if (!productSituation) {
                return res.status(404).json({ error: "Situação de produto não encontrada." });
            }

            return res.json({ message: "Situação de produto deletada com sucesso." });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao deletar situação de produto." });
        }
    }
}
