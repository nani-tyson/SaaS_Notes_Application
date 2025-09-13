import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import NoteItem from './NoteItem';

const AuthorNotesSection = ({ authorEmail, notes, isExpanded, onToggle, onEditNote, onDeleteNote, isCurrentUser }) => {
    return (
        <div>
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center text-left text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2"
            >
                <span>{isCurrentUser ? 'My Notes' : `Notes by ${authorEmail}`}</span>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <FiChevronDown />
                </motion.div>
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notes.map(note => (
                                <NoteItem 
                                    key={note._id} 
                                    note={note} 
                                    onDelete={onDeleteNote} 
                                    onEdit={onEditNote} 
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuthorNotesSection;
