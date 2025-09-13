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
        // --- THIS IS THE ONLY CHANGE ---
        // We add .populate() to replace the authorId with the actual author's document.
        // The second argument, 'email', tells it to only include the email field.
        const notes = await Note.find({ tenantId: req.user.tenantId })
            .sort({ createdAt: -1 })
            .populate('authorId', 'email'); // <-- ADD THIS LINE

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
        // SECURE: Find the note by its ID AND ensure it belongs to the user's tenant
        const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId })
                               .populate('authorId', 'email'); // Also populate the author's email

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
export const updateNote = async (req, res) => {
    const { title, content } = req.body;
    
    try {
        // Find the note, ensuring it belongs to the correct tenant for security
        let note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        // Update the fields
        note.title = title;
        note.content = content;
        
        const updatedNote = await note.save();
        
        res.json(updatedNote);
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
