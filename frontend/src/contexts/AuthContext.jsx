import { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const getInitialState = () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = jwtDecode(token).user;
            return { token, user: decodedUser };
        }
    } catch (e) {
        console.error("Invalid token found in localStorage", e);
        localStorage.removeItem('token');
    }
    return { token: null, user: null };
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getInitialState().token);
    const [user, setUser] = useState(getInitialState().user);

    const login = async (email, password) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) { throw new Error(data.msg || 'Login failed'); }
        setToken(data.token);
        setUser(jwtDecode(data.token).user);
        localStorage.setItem('token', data.token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const refreshSession = (newToken) => {
        setToken(newToken);
        setUser(jwtDecode(newToken).user);
        localStorage.setItem('token', newToken);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);