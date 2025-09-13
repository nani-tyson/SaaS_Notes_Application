import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import NotesPage from './pages/NotesPage';
import UpgradePage from './pages/UpgradePage';
import MainLayout from './components/MainLayout';
import TeamPage from './pages/TeamPage.jsx';
import NoteDetailPage from './pages/NoteDetailPage.jsx';

function ProtectedRoutes() {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" />;
    }
    return <MainLayout />;
}

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<NotesPage />} />
                    <Route path="/upgrade" element={<UpgradePage />} />
                    <Route path="/notes/:id" element={<NoteDetailPage />} />
                    <Route path="/team" element={<TeamPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

function App() {
    return (
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
    );
}

export default App;