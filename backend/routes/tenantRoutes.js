import { Router } from 'express';
import { upgradeTenantPlan } from '../controllers/tenantController.js';
import {authMiddleware, adminMiddleware} from '../middleware/authMiddleware.js';

const router = Router();

// @route   POST /tenants/:slug/upgrade
// @desc    Upgrade a tenant's plan to 'pro'
// @access  Private, Admin only
router.post(
    '/:slug/upgrade',
    authMiddleware,
    adminMiddleware,
    upgradeTenantPlan
);

export default router;
