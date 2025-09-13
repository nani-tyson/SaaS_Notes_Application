import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthorNotesSection from '../components/AuthorNotesSection';
import EditNoteModal from '../components/EditNoteModal';
import UpgradePrompt from '../components/UpgradePrompt';
import { FiPlus, FiStar } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { getNotes, createNote, deleteNote, updateNote } from '../services/api';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentNoteToEdit, setCurrentNoteToEdit] = useState(null);
    const { user } = useAuth();
    
    const [expandedAuthors, setExpandedAuthors] = useState([]);

    const isLimitReached = user?.plan === 'free' && notes.length >= 3;

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setIsLoading(true);
                const fetchedNotes = await getNotes();
                setNotes(fetchedNotes);
                if (user?.email) {
                    setExpandedAuthors([user.email]);
                }
            } catch (err) { 
                setError('Failed to fetch notes.'); 
            } finally { 
                setIsLoading(false); 
            }
        };
        fetchNotes();
    }, [user?.email]);

    const groupedNotes = useMemo(() => {
        if (!notes.length) return {};
        const groups = notes.reduce((acc, note) => {
            const authorEmail = note.authorId?.email || 'Unknown Author';
            if (!acc[authorEmail]) acc[authorEmail] = [];
            acc[authorEmail].push(note);
            return acc;
        }, {});
        return Object.keys(groups).sort((a, b) => {
            if (a === user.email) return -1;
            if (b === user.email) return 1;
            return a.localeCompare(b);
        }).reduce((sortedAcc, key) => {
            sortedAcc[key] = groups[key];
            return sortedAcc;
        }, {});
    }, [notes, user.email]);
    
    const toggleAuthorSection = (authorEmail) => {
        setExpandedAuthors(prev => 
            prev.includes(authorEmail) 
                ? prev.filter(email => email !== authorEmail) 
                : [...prev, authorEmail]
        );
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        setError('');
        if (isLimitReached) {
            setError("Upgrade to Pro to create more notes.");
            return;
        }
        try {
            const newNote = await createNote({ title, content });
            setNotes([newNote, ...notes]);
            setTitle('');
            setContent('');
        } catch (err) { 
            setError(err.message); 
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await deleteNote(id);
            setNotes(notes.filter(note => note._id !== id));
        } catch (err) { 
            setError('Failed to delete note.'); 
        }
    };
    
    const handleOpenEditModal = (note) => {
        setCurrentNoteToEdit(note);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setCurrentNoteToEdit(null);
        setIsEditModalOpen(false);
    };

    const handleUpdateNote = async (noteId, updatedData) => {
        try {
            const updatedNote = await updateNote(noteId, updatedData);
            setNotes(notes.map(note => note._id === noteId ? updatedNote : note));
            handleCloseEditModal();
        } catch (err) {
            setError('Failed to update note.');
        }
    };

    return (
        <>
            <Helmet><title>Your Notes | SaaS Notes</title></Helmet>
            <div className="p-4 md:p-8">
                {(() => {
                    if (user?.plan === 'pro') {
                        return (
                            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg p-6 mb-8 flex items-center">
                                <FiStar size={24} className="mr-4" />
                                <div>
                                    <h4 className="font-bold text-lg">You are a Pro User</h4>
                                    <p className="text-sm">Enjoy unlimited notes and all features!</p>
                                </div>
                            </div>
                        );
                    }
                    if (isLimitReached) {
                        return <UpgradePrompt />;
                    }
                    return null;
                })()}
                
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-white p-6 rounded-lg shadow-md mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Create a New Note</h2>
                    <form onSubmit={handleCreateNote}>
                        <input 
                            type="text" 
                            placeholder="Note Title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            required 
                        />
                        <textarea 
                            placeholder="Note Content..." 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            rows="3"
                        ></textarea>
                        {error && !isLimitReached && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button 
                            type="submit" 
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
                        >
                            <FiPlus className="mr-2"/> Add Note
                        </button>
                    </form>
                </motion.div>
                
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading notes...</p>
                ) : notes.length > 0 ? (
                    <div className="space-y-4">
                        {Object.keys(groupedNotes).map(authorEmail => (
                            <AuthorNotesSection
                                key={authorEmail}
                                authorEmail={authorEmail}
                                notes={groupedNotes[authorEmail]}
                                isExpanded={expandedAuthors.includes(authorEmail)}
                                onToggle={() => toggleAuthorSection(authorEmail)}
                                onEditNote={handleOpenEditModal}
                                onDeleteNote={handleDeleteNote}
                                isCurrentUser={authorEmail === user.email}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">You don't have any notes yet. Create one above!</p>
                    </div>
                )}
            </div>
            <EditNoteModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                note={currentNoteToEdit}
                onSave={handleUpdateNote}
            />
        </>
    );
};
export default NotesPage;