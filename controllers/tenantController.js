import Tenant from '../models/Tenant.js';

export const upgradeTenantPlan = async (req, res) => {
    try {
        const tenant = await Tenant.findOne({ slug: req.params.slug });

        if (!tenant) {
            return res.status(404).json({ msg: 'Tenant not found' });
        }
        
        // SECURITY CHECK: Ensure the admin belongs to the tenant they are trying to upgrade.
        // An admin from Globex should not be able to upgrade Acme.
        if (tenant._id.toString() !== req.user.tenantId) {
            return res.status(403).json({ msg: 'Forbidden: You can only upgrade your own tenant' });
        }

        tenant.plan = 'pro';
        await tenant.save();

        res.json({ msg: `Tenant '${tenant.name}' has been upgraded to the Pro plan.` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
