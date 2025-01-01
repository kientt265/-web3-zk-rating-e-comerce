import { Router } from "express";
import { verifyProofController } from '../controller/verifyProof.controller.js';

const router = Router();

router.post('/verify', verifyProofController);

export default router;
