import { Router } from "express";
import {
  getEprsController,
  getEprDetailController,
  createEprController,
  updateEprController,
  assistEprController
} from "../controllers/epr.controller";

const router = Router();

// LIST
router.get("/", getEprsController);

// DETAIL
router.get("/:id", getEprDetailController);

// CREATE
router.post("/", createEprController);

// UPDATE
router.patch("/:id", updateEprController);

// GENERATED REMARK
router.post("/assist", assistEprController);

export default router;