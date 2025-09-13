import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js'; // <-- We need this to get the plan
import connectDB from '../config/db.js';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // --- THIS IS THE CRUCIAL UPDATE ---
        // We find the user's tenant to get their plan and other details.
        const tenant = await Tenant.findById(user.tenantId);
        if (!tenant) {
            return res.status(404).json({ msg: 'Associated tenant not found' });
        }

        
        const payload = {
            user: {
                id: user.id,
                tenantId: user.tenantId,
                role: user.role,
                plan: tenant.plan,     
                slug: tenant.slug,     
                email: user.email,     
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
