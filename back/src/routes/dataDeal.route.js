import { Router } from "express";
import { saveNewDealIdController } from '../controller/dataDeal.controller.js';
const router = Router();

router.post('/dealId', saveNewDealIdController);

export default router;