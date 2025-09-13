const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'An API error occurred');
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return null;
    }
};



export const getNotes = () => fetchWithAuth('/notes');
export const createNote = (noteData) => fetchWithAuth('/notes', { method: 'POST', body: JSON.stringify(noteData) });
export const deleteNote = (noteId) => fetchWithAuth(`/notes/${noteId}`, { method: 'DELETE' });
export const upgradeTenantPlan = (slug) => fetchWithAuth(`/tenants/${slug}/upgrade`, { method: 'POST' });
export const getTenantUsers = () => fetchWithAuth('/users');

export const inviteUser = (email) => fetchWithAuth('/users/invite', {
    method: 'POST',
    body: JSON.stringify({ email }),
});

export const updateNote = (noteId, noteData) => {
    return fetchWithAuth(`/notes/${noteId}`, {
        method: 'PUT',
        body: JSON.stringify(noteData),
    });
};

export const getNoteById = (noteId) => fetchWithAuth(`/notes/${noteId}`)