import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { FiMail, FiLock } from 'react-icons/fi';

const LoginPage = () => {
    const [email, setEmail] = useState('admin@acme.test');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login');
        }
    };

    return (
        <>
            <title>Login | SaaS Notes</title>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
                    <div className="flex flex-col justify-center p-8 md:p-14">
                        <span className="mb-3 text-4xl font-bold">Welcome back</span>
                        <span className="font-light text-gray-400 mb-8">Please enter your details.</span>
                        <form onSubmit={handleSubmit}>
                            <div className="relative flex items-center mb-4"><FiMail className="absolute ml-3 text-gray-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full py-2 pl-10 pr-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500" /></div>
                            <div className="relative flex items-center mb-6"><FiLock className="absolute ml-3 text-gray-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full py-2 pl-10 pr-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500" /></div>
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-lg mb-6 hover:bg-indigo-700 transition duration-300">Sign in</button>
                        </form>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1170&q=80" alt="img" className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"/>
                    </div>
                </div>
            </div>
        </>
    );
};
export default LoginPage;