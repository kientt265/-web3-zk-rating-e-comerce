import { Router } from "express";
import { getRequestController } from '../controller/request.controller.js';
const router = Router();

router.get('/request/:dealId', getRequestController);

export default router;