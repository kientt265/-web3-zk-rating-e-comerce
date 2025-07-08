import { Router } from "express";
import { getRatingsController } from '../controller/rating.controller.js';
import { saveRatingController } from '../controller/saveRating.controller.js';
const router = Router();

router.get('/ratings/:productId', getRatingsController);
router.post('/ratings', saveRatingController); // <-- Thêm dòng này

export default router;