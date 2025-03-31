import { Router } from "express";
import { saveNullfierController } from '../controller/saveNullifier.controller.js';

const router = Router();

router.post('/nullifier', saveNullfierController);

export default router;
