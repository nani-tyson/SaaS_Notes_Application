import { useAuth } from '../contexts/AuthContext';
import { NavLink, Outlet } from 'react-router-dom';
import { FiFileText, FiLogOut, FiZap, FiUser } from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const showUpgradeLink = user?.role === 'admin' && user?.plan === 'free';
    const showTeamLink = user?.role === 'admin'; // Condition for the new link

    return (
        <div className="w-64 bg-white shadow-lg flex-shrink-0 flex-col h-screen hidden md:flex">
            <div className="p-6 border-b"><h1 className="text-2xl font-bold text-indigo-600">SaaS Notes</h1></div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/" end className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <FiFileText className="mr-3" /> My Notes
                </NavLink>
                {/* This link will now always show for any user with the 'admin' role */}
                {showUpgradeLink && (
                    <NavLink to="/upgrade" className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <FiZap className="mr-3 text-yellow-500" /> Manage Plan
                    </NavLink>
                    
                )}
                {showTeamLink && (
                    <NavLink to="/team" className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <FiUser className="mr-3" /> Team
                    </NavLink>
                )}
            </nav>
            

            
            <div className="p-4 border-t mt-auto">
                <div className="flex items-center mb-4"><FiUser className="mr-3 text-gray-500" /><span className="text-sm text-gray-600 truncate">{user?.email}</span></div>
                <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-red-600 hover:bg-gray-100 transition-colors ">
                    <FiLogOut className="mr-3" /> Logout
                </button>
            </div>
        </div>
    );
}

const MainLayout = () => (
    <div className="flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto h-screen">
            <Outlet />
        </main>
    </div>
);

export default MainLayout;