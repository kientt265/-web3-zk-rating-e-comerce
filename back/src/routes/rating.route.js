import { Router } from "express";
import { getRatingsController } from '../controller/rating.controller.js';
const router = Router();

router.get('/ratings/:productId', getRatingsController);

export default router;