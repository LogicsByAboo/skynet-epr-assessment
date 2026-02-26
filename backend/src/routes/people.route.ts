import { Router } from "express";
import { getPeopleController } from "../controllers/people.controller";

const router = Router();

router.get("/", getPeopleController);

export default router;