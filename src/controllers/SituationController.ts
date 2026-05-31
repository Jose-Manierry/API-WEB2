import { Request, Response } from "express";
import { SituationService } from "../services/SituationService";
import * as yup from "yup";


export class SituationController {

    static async index(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await SituationService.findAll({ page, limit });
            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar situações." });
        }
    }

    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const situation = await SituationService.findById(Number(id));

            if (!situation) {
                return res.status(404).json({ error: "Situação não encontrada." });
            }

            return res.json(situation);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar situação." });
        }
    }

    static async store(req: Request, res: Response) {
        try {
            const schema = yup.object().shape({
                nameSituation: yup.string()
                    .required("Por favor, informe o nome da situação.")
                    .min(3, "O nome da situação deve ser mais detalhado (mínimo 3 letras).")
                    .trim()
                    .test("unique-situation", "Já existe uma situação cadastrada com este nome.", async (value) => {
                        if (!value) return true;
                        const exists = await SituationService.findByNameSituation(value);
                        return !exists;
                    })
            });

            await schema.validate(req.body, { abortEarly: false });

            const { nameSituation } = req.body;
            const situation = await SituationService.create({ nameSituation });
            return res.status(201).json(situation);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({ type: "ValidationError", messages: error.errors });
            }
            return res.status(500).json({ error: "Erro ao criar situação." });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const schema = yup.object().shape({
                nameSituation: yup.string()
                    .required("O campo nome da situação não pode ficar vazio.")
                    .min(3, "O nome atualizado deve ter pelo menos 3 caracteres.")
                    .trim()
                    .test("unique-situation-update", "Este nome de situação já está sendo usado por outro registro.", async (value) => {
                        if (!value) return true;
                        const exists = await SituationService.findByNameSituation(value);
                        return !exists || (exists as { id: number }).id === Number(id);
                    })
            });

            await schema.validate(req.body, { abortEarly: false });

            const { nameSituation } = req.body;
            const situation = await SituationService.update(Number(id), { nameSituation });

            if (!situation) {
                return res.status(404).json({ error: "Situação não encontrada." });
            }
            return res.json(situation);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({ type: "ValidationError", messages: error.errors });
            }
            return res.status(500).json({ error: "Erro ao atualizar situação." });
        }
    }

    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const situation = await SituationService.delete(Number(id));

            if (!situation) {
                return res.status(404).json({ error: "Situação não encontrada." });
            }

            return res.json({ message: "Situação deletada com sucesso." });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao deletar situação." });
        }
    }
}
