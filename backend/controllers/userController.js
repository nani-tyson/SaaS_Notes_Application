import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';

// @route   POST /api/users/invite
// @desc    Admin invites a new member to their tenant
// @access  Private, Admin
export const inviteUser = async (req, res) => {
    const { email } = req.body;
    const { tenantId } = req.user; // The admin's tenantId from their token

    try {
        await connectDB();
        // Check if user with this email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // For this project, we'll set a default password.
        // In a real-world app, you'd send an email with a unique signup link.
        const defaultPassword = 'password';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        user = new User({
            email,
            password: hashedPassword,
            tenantId,
            role: 'member', // New users are always members
        });

        await user.save();

        // Don't send the password back
        const userResponse = { ...user.toObject() };
        delete userResponse.password;
        
        res.status(201).json(userResponse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/users
// @desc    Get all users for the current tenant
// @access  Private, Admin
export const getTenantUsers = async (req, res) => {
    try {
        await connectDB();
        const users = await User.find({ tenantId: req.user.tenantId }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
