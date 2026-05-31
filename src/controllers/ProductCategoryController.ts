import { Request, Response } from "express";
import { ProductCategoryService } from "../services/ProductCategoryService";
import * as yup from "yup";

export class ProductCategoryController {

    static async index(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await ProductCategoryService.findAll({ page, limit });
            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar categorias de produtos." });
        }
    }

    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const productCategory = await ProductCategoryService.findById(Number(id));

            if (!productCategory) {
                return res.status(404).json({ error: "Categoria de produto não encontrada." });
            }

            return res.json(productCategory);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar categoria de produto." });
        }
    }

    static async store(req: Request, res: Response) {
        try {
            const schema = yup.object().shape({
                name: yup.string()
                    .required("A categoria precisa de um nome válido.")
                    .min(3, "O nome da categoria é muito curto (mínimo 3 caracteres).")
                    .max(50, "O nome da categoria não pode exceder 50 caracteres.")
                    .test("unique-category", "Esta categoria de produto já existe.", async (value) => {
                        if (!value) return true;
                        const exists = await ProductCategoryService.findByName(value);
                        return !exists;
                    })
            });

            await schema.validate(req.body, { abortEarly: false });

            const { name } = req.body;
            const productCategory = await ProductCategoryService.create({ name });
            return res.status(201).json(productCategory);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({ type: "ValidationError", messages: error.errors });
            }
            return res.status(500).json({ error: "Erro ao criar categoria de produto." });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const schema = yup.object().shape({
                name: yup.string()
                    .required("O nome da categoria é obrigatório para atualização.")
                    .min(3, "O novo nome deve ter pelo menos 3 caracteres.")
                    .test("unique-category-update", "Este nome de categoria já está em uso.", async (value) => {
                        if (!value) return true;
                        const exists = await ProductCategoryService.findByName(value);
                        return !exists || (exists as { id: number }).id === Number(id);
                    })
            });

            await schema.validate(req.body, { abortEarly: false });

            const { name } = req.body;
            const productCategory = await ProductCategoryService.update(Number(id), { name });

            if (!productCategory) {
                return res.status(404).json({ error: "Categoria de produto não encontrada." });
            }
            return res.json(productCategory);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({ type: "ValidationError", messages: error.errors });
            }
            return res.status(500).json({ error: "Erro ao atualizar categoria de produto." });
        }
    }

    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const productCategory = await ProductCategoryService.delete(Number(id));

            if (!productCategory) {
                return res.status(404).json({ error: "Categoria de produto não encontrada." });
            }

            return res.json({ message: "Categoria de produto deletada com sucesso." });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao deletar categoria de produto." });
        }
    }
}
