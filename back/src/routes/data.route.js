import { Router } from "express";
import { saveNewBlockController } from '../controller/data.controller.js';

const router = Router();

router.post('/block', saveNewBlockController);

export default router;