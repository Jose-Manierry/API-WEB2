import { Router } from "express";
import { SituationController } from "../controllers/SituationController";

const router = Router();

router.get("/", SituationController.index);
router.get("/:id", SituationController.show);
router.post("/", SituationController.store);
router.put("/:id", SituationController.update);
router.delete("/:id", SituationController.destroy);

export default router;
