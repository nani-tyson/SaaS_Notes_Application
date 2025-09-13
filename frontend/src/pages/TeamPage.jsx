import { useState, useEffect } from 'react';
import { getTenantUsers, inviteUser } from '../services/api';
import { FiUserPlus, FiMail, FiShield, FiUser } from 'react-icons/fi';

const TeamPage = () => {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const tenantUsers = await getTenantUsers();
                setUsers(tenantUsers);
            } catch (err) {
                setError('Failed to fetch team members.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleInvite = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const newUser = await inviteUser(email);
            setUsers([...users, newUser]);
            setSuccess(`Successfully invited ${email}. They can now log in with the default password.`);
            setEmail('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <title>Team Management | SaaS Notes</title>
            <div className="p-4 md:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Team Management</h1>

                {/* Invite User Form */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Invite New Member</h2>
                    <form onSubmit={handleInvite}>
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-grow">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="new.member@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <button type="submit" className="bg-indigo-600 text-white py-2 px-5 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center">
                                <FiUserPlus className="mr-2" /> Invite User
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
                    </form>
                </div>

                {/* Team Members List */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">Current Team</h2>
                     {isLoading ? <p>Loading team members...</p> : (
                        <ul className="space-y-4">
                            {users.map(user => (
                                <li key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="mr-4 p-2 bg-gray-200 rounded-full">
                                            {user.role === 'admin' ? <FiShield className="text-indigo-600" /> : <FiUser className="text-gray-500" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">{user.email}</p>
                                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                     )}
                </div>
            </div>
        </>
    );
};

export default TeamPage;
