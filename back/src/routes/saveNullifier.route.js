import { Router } from "express";
import { saveNullfierController } from '../controller/saveNullifier.controller';

const router = Router();

router.post('/nullifier', saveNullfierController);

export default router;
