import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/context/constants.ts'
import { jwtDecode } from 'jwt-decode'
import api from '@/api.ts'

type ProtectedRouteProps = {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    // Check if the user is authenticated
    useEffect(() => {
        auth().catch((error) => {
            console.log('error', error)
            setIsAuthenticated(false)
        })
    }, [])

    // Refresh the token
    const refreshToken = async () => {
        const refreshedToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const response = await api.post('/token/refresh/', {
                refresh: refreshedToken,
            })

            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        } catch (error) {
            console.log('error', error)
            setIsAuthenticated(false)
        }
    }

    // Authenticate
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthenticated(false)
            return
        }

        const decoded = jwtDecode(token)
        const tokenExp = decoded.exp
        const now = Date.now() / 1000 // to get in seconds

        if (tokenExp && tokenExp < now) {
            await refreshToken()
        } else {
            setIsAuthenticated(true)
        }
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    return isAuthenticated ? children : <Navigate to={'/login'} />
}

export default ProtectedRoute
