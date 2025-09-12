import Note from '../models/Note.js';
import Tenant from '../models/Tenant.js';

// --- Create a Note (with Subscription Limit Check) ---
export const createNote = async (req, res) => {
    const { title, content } = req.body;
    const { id: authorId, tenantId } = req.user;

    try {
        // Subscription Gating Logic
        const tenant = await Tenant.findById(tenantId);
        if (tenant.plan === 'free') {
            const noteCount = await Note.countDocuments({ tenantId });
            if (noteCount >= 3) {
                return res.status(403).json({ msg: 'Free plan limit of 3 notes reached. Please upgrade.' });
            }
        }

        const newNote = new Note({ title, content, authorId, tenantId });
        const note = await newNote.save();
        res.status(201).json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Get All Notes for the Logged-in User's Tenant ---
export const getNotes = async (req, res) => {
    try {
        // This query ONLY looks for notes matching the user's tenantId from their JWT.
        const notes = await Note.find({ tenantId: req.user.tenantId });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Get, Update, and Delete a Single Note ---
// We combine the check to ensure the note exists AND belongs to the correct tenant.

export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateNote = async (req, res) => {
    const { title, content } = req.body;
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.user.tenantId }, // Condition
            { $set: { title, content } }, // Update
            { new: true } // Return the updated document
        );
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        res.json({ msg: 'Note removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
