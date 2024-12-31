import { Router } from "express";
import { saveNewLogsController } from '../controller/data.controller.js';

const router = Router();

router.post('/logs', saveNewLogsController);

export default router;
