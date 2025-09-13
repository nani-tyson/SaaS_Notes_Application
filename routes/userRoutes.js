import { Router } from 'express';
import { inviteUser, getTenantUsers } from '../controllers/userController.js';
import {authMiddleware, adminMiddleware} from '../middleware/authMiddleware.js';

const router = Router();

// These routes are only accessible to logged-in admins
router.use(authMiddleware);
router.use(adminMiddleware);

router.route('/')
    .get(getTenantUsers);

router.route('/invite')
    .post(inviteUser);

export default router;
