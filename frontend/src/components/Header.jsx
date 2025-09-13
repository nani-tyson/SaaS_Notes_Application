import { useAuth } from '../contexts/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const Header = () => {
    const { logout, user } = useAuth();

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-600">SaaS Notes</h1>
                <div className="flex items-center space-x-4">
                    {/* Display the user's email if available */}
                    {user && <span className="text-gray-600 text-sm hidden sm:block">Welcome, {user.email}</span>}
                    <button 
                        onClick={logout}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
                    >
                        <FiLogOut className="mr-2" />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
