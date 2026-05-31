import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
    res.json({ message: "ProjetWeb2 - P1 rodando com sucesso!" });
});

AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados conectado com sucesso!");

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesse: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Erro ao conectar com o banco de dados:", error);
    });
