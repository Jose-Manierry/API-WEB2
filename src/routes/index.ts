import { Router } from "express";
import situationRoutes from "./situationRoutes";
import productCategoryRoutes from "./productCategoryRoutes";
import productSituationRoutes from "./productSituationRoutes";
import productRoutes from "./productRoutes";
import testConnectController from "../controllers/testConnectController";
import UserController from "../controllers/UserController";

const router = Router();

router.use("/", testConnectController); // Rota para testar a conexão com a API
router.use("/", UserController); // O UserController agora define o prefixo /users internamente

router.use("/situations", situationRoutes);
router.use("/product-categories", productCategoryRoutes);
router.use("/product-situations", productSituationRoutes);
router.use("/products", productRoutes);

export default router;
