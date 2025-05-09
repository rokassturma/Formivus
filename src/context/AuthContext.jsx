import axios from 'axios';
import { createContext, useEffect, useState } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/me', { withCredentials: true })
            .then(res => setCurrentUser(res.data.user))
            .catch(() => setCurrentUser(null));
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    )
}