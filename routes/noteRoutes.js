import { Router } from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { 
    createNote, 
    getNotes, 
    getNoteById, 
    updateNote, 
    deleteNote 
} from '../controllers/notesController.js';

const router = Router();

// This line applies the authMiddleware to ALL routes in this file.
// No one can even attempt to access these endpoints without a valid token.
router.use(authMiddleware);

// Route for /notes
router.route('/')
    .post(createNote)
    .get(getNotes);

// Route for /notes/:id
router.route('/:id')
    .get(getNoteById)
    .put(updateNote)
    .delete(deleteNote);

export default router;
