import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import * as yup from "yup";

export class ProductController {

    static async index(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await ProductService.findAll({ page, limit });
            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar produtos." });
        }
    }

    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await ProductService.findById(Number(id));

            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado." });
            }

            return res.json(product);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar produto." });
        }
    }

    static async store(req: Request, res: Response) {
        try {
            const schema = yup.object().shape({
                name: yup.string()
                    .required("O nome do produto é obrigatório.")
                    .min(2, "O nome do produto deve ter pelo menos 2 caracteres."),
                productSituationId: yup.number()
                    .required("A situação do produto é obrigatória."),
                productCategoryId: yup.number()
                    .required("A categoria do produto é obrigatória.")
            });

            await schema.validate(req.body, { abortEarly: false });

            const { name, productSituationId, productCategoryId } = req.body;
            const product = await ProductService.create({ name, productSituationId, productCategoryId });
            return res.status(201).json(product);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({ type: "ValidationError", messages: error.errors });
            }
            return res.status(500).json({ error: "Erro ao criar produto." });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const schema = yup.object().shape({
                name: yup.string()
                    .min(2, "O nome do produto deve ter pelo menos 2 caracteres."),
                productSituationId: yup.number(),
                productCategoryId: yup.number()
            });

            await schema.validate(req.body, { abortEarly: false });

            const { name, productSituationId, productCategoryId } = req.body;
            const product = await ProductService.update(Number(id), { name, productSituationId, productCategoryId });

            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado." });
            }

            return res.json(product);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({ type: "ValidationError", messages: error.errors });
            }
            return res.status(500).json({ error: "Erro ao atualizar produto." });
        }
    }

    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await ProductService.delete(Number(id));

            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado." });
            }

            return res.json({ message: "Produto deletado com sucesso." });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao deletar produto." });
        }
    }
}
