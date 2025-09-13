import { FiEdit2 ,FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import {Link} from 'react-router-dom';

const NoteItem = ({ note, onDelete, onEdit }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between"
    >
        <Link to={`/notes/${note._id}`} className="p-5 block flex-grow hover:bg-gray-50 rounded-t-lg">
            <h3 className="font-bold text-lg text-gray-800 mb-2 break-words">{note.title}</h3>
            <p className="text-gray-600 text-sm break-words">{note.content}</p>
        </Link>
        <div className="flex justify-end mt-4">
            <button onClick={() => onEdit(note)} className="text-gray-400 hover:text-indigo-500 transition duration-300">
                <FiEdit2 size={18} />
            </button>
            <button onClick={() => onDelete(note._id)} className="text-gray-400 hover:text-red-500 transition duration-300">
                <FiTrash2 size={18} />
            </button>
        </div>
    </motion.div>
);

export default NoteItem;