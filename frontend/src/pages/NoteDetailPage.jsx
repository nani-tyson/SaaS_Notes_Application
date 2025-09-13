import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNoteById } from '../services/api';
import { FiArrowLeft } from 'react-icons/fi';

const NoteDetailPage = () => {
    const [note, setNote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams(); // Get the note ID from the URL

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const fetchedNote = await getNoteById(id);
                setNote(fetchedNote);
            } catch (err) {
                setError('Failed to fetch note. It may not exist or you may not have permission to view it.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading note...</div>;
    }
    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <>
            <title>{note?.title || 'Note'} | SaaS Notes</title>
            <div className="p-4 md:p-8">
                <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
                    <FiArrowLeft className="mr-2" />
                    Back to all notes
                </Link>
                {note && (
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">{note.title}</h1>
                        <p className="text-sm text-gray-500 mb-6">Created by: {note.authorId?.email}</p>
                        <div className="prose max-w-none">
                            <p>{note.content}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default NoteDetailPage;
