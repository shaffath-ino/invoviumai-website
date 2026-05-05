import React, { createContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AUTH_STORAGE_KEYS = [
    'token',
    'username',
    'userRole',
    'userId',
    'roleType',
    'firstName',
    'branchName',
];

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [roleType, setRoleType] = useState(localStorage.getItem('roleType'));
    const [firstName, setFirstName] = useState(localStorage.getItem('firstName'));
    const [branchName, setBranchName] = useState(localStorage.getItem('branchName'));

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        }
        if (userRole) {
            localStorage.setItem('userRole', userRole);
        }
        if (userId) {
            localStorage.setItem('userId', userId);
        }
        if (roleType) {
            localStorage.setItem('roleType', roleType);
        }
        if (firstName) {
            localStorage.setItem('firstName', firstName);
        }
        if (branchName) {
            localStorage.setItem('branchName', branchName);
        }
    }, [username, userRole, userId, roleType, firstName, branchName]);

    const login = (username, userRole, userId, roleType, firstName, branchName) => {
        setUsername(username);
        setUserRole(userRole);
        setUserId(userId);
        setRoleType(roleType);
        setFirstName(firstName);
        setBranchName(branchName);
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userId', userId);
        localStorage.setItem('roleType', roleType);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('branchName', branchName);
    };

    const logout = () => {
        setUsername(null);
        setUserRole(null);
        setUserId(null);
        setRoleType(null);
        setFirstName(null);
        setBranchName(null);
        AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    };

    return (
        <AuthContext.Provider value={{ username, userRole, userId, roleType, firstName, branchName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
