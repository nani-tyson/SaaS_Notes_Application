import Tenant from '../models/Tenant.js';
import User from '../models/User.js';       // 1. ADD THIS IMPORT
import jwt from 'jsonwebtoken';           // 2. ADD THIS IMPORT
import connectDB from '../config/db.js';

export const upgradeTenantPlan = async (req, res) => {
    try {
        await connectDB();
        const tenant = await Tenant.findOne({ slug: req.params.slug });
        if (!tenant) {
            return res.status(404).json({ msg: 'Tenant not found' });
        }
        if (tenant._id.toString() !== req.user.tenantId) {
            return res.status(403).json({ msg: 'Forbidden: You can only upgrade your own tenant' });
        }

        tenant.plan = 'pro';
        await tenant.save();

        // --- 3. ADD THIS NEW LOGIC ---
        // After upgrading, we find the user and generate a NEW token with the updated plan.
        const user = await User.findById(req.user.id);
        const payload = {
            user: {
                id: user.id,
                tenantId: user.tenantId,
                role: user.role,
                plan: tenant.plan, // The new 'pro' plan
                slug: tenant.slug,
                email: user.email,
            },
        };

        const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
        // --- END OF NEW LOGIC ---


        // 4. UPDATE THE RESPONSE TO SEND THE NEW TOKEN
        res.json({
            msg: `Tenant '${tenant.name}' has been upgraded to the Pro plan.`,
            newtoken: newToken, // <-- Send the new token back to the frontend
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};