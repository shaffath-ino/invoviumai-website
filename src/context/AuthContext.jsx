import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

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
    };

    return (
        <AuthContext.Provider value={{ username, userRole, userId, roleType, firstName, branchName, login }}>
            {children}
        </AuthContext.Provider>
    );
};
