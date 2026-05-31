import { AppDataSource } from "../data-source";
import { Situation } from "../entities/Situation";

export async function SituationSeeder() {
    const situationRepository = AppDataSource.getRepository(Situation);

    const situations = [
        { nameSituation: "Ativo" },
        { nameSituation: "Inativo" },
        { nameSituation: "Pendente" }
    ];

    for (const data of situations) {
        const exists = await situationRepository.findOneBy({ nameSituation: data.nameSituation });
        if (!exists) {
            const situation = situationRepository.create(data);
            await situationRepository.save(situation);
            console.log(`Situação '${data.nameSituation}' criada com sucesso.`);
        } else {
            console.log(`Situação '${data.nameSituation}' já existe.`);
        }
    }
}
