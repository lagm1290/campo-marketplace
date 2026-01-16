import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('access_token')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('access_token') ? jwtDecode(localStorage.getItem('access_token')) : null)
    const navigate = useNavigate();

    let loginUser = async (e) => {
        e.preventDefault();
        let response = await fetch('http://127.0.0.1:8000/api/auth/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
        })
        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('access_token', JSON.stringify(data.access)) // Storing simpler for now
            localStorage.setItem('refresh_token', JSON.stringify(data.refresh))
            navigate('/')
        } else {
            alert('Something went wrong!')
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        navigate('/login')
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
