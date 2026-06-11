import { Router } from "express";
import situationRoutes from "./situationRoutes";
import productCategoryRoutes from "./productCategoryRoutes";
import productSituationRoutes from "./productSituationRoutes";
import productRoutes from "./productRoutes";
import testConnectController from "../controllers/testConnectController";
import UserController from "../controllers/UserController";
import authRoutes from "../controllers/AuthController";

const router = Router();

router.use("/", testConnectController);
router.use("/auth", authRoutes);       // prefixo /auth adicionado
router.use("/", UserController);

router.use("/situations", situationRoutes);
router.use("/product-categories", productCategoryRoutes);
router.use("/product-situations", productSituationRoutes);
router.use("/products", productRoutes);

export default router;