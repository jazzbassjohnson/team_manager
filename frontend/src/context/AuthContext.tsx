import React, { createContext, useEffect, useState } from 'react'
import api from '../api.ts'

interface AuthContextProps {
    isAuthenticated: boolean
    user: any
    login: (username: string, password: string) => Promise<void>
    register: (
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => Promise<void>
    refresh: () => Promise<void>
    logout: () => void
}

const initialProps: AuthContextProps = {
    isAuthenticated: false,
    user: null,
    login: async () => {},
    register: async () => {},
    refresh: async () => {},
    logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initialProps)

type AuthProviderProps = {
    children: React.ReactNode
}
const AuthProvider: React.FC<AuthProviderProps> = ({
    children,
}: AuthProviderProps) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            console.log('user', user)
            // setUser(JSON.parse(user))
        }
    }, [])

    const login = async (username: string, password: string) => {
        const response = await api.post('/token/', {
            username,
            password,
        })
        const data = response.data
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
    }

    const refresh = async () => {
        const refresh = localStorage.getItem('refresh_token')
        const response = await api.post('/token/refresh/', {
            refresh,
        })
        const data = response.data
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
    }

    const register = async (
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => {
        const response = await api.post('/user/register/', {
            username,
            first_name: firstName,
            last_name: lastName,
            email,
            password,
        })
        const data = response.data
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                login,
                register,
                logout,
                refresh,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
