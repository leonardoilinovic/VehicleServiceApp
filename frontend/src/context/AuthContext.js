// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (token) => {
        localStorage.setItem('userToken', token);
        setCurrentUser({ token });
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setCurrentUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            setCurrentUser({ token });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
