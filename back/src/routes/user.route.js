import Router from 'express';
import { loginController, registerController } from '../controller/user.controller';

const router = Router();

router.post('/user/register', registerController);
router.post('/user/login', loginController);

export default router;

