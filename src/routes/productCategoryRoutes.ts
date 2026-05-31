import { Router } from "express";
import { ProductCategoryController } from "../controllers/ProductCategoryController";

const router = Router();

router.get("/", ProductCategoryController.index);
router.get("/:id", ProductCategoryController.show);
router.post("/", ProductCategoryController.store);
router.put("/:id", ProductCategoryController.update);
router.delete("/:id", ProductCategoryController.destroy);

export default router;
