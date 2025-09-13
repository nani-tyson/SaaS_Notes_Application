import { Router } from 'express';
import { loginUser,  } from '../controllers/authController.js';

const router = Router();

// @route   POST /auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

export default router;
