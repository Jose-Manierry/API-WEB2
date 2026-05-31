import { Router } from "express";
import { ProductSituationController } from "../controllers/ProductSituationController";

const router = Router();

router.get("/", ProductSituationController.index);
router.get("/:id", ProductSituationController.show);
router.post("/", ProductSituationController.store);
router.put("/:id", ProductSituationController.update);
router.delete("/:id", ProductSituationController.destroy);

export default router;
