import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "admin",
    database: process.env.DB_NAME || "nodeapi",
    synchronize: false, // Alterado para true para criar as colunas que faltam automaticamente
    logging: true,
    entities: ["dist/entities/*.js"],
    migrations: ["dist/migration/*.js"],
    subscribers: [],
});