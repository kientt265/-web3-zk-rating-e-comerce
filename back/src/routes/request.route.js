import { Router } from "express";
import { getRquestController } from '../controller/request.controller.js';
const router = Router();

router.post('/dealId', getRquestController);

export default router;