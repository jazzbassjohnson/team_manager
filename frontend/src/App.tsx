import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.tsx'
import PageNotFound from './pages/PageNotFound.tsx'
import Register from './pages/Register.tsx'
import Logout from '@/pages/Logout.tsx'
import ProtectedRoute from '@/components/ProtextedRoute.tsx'
import Dashboard from '@/pages/Dashboard.tsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                // Logout and register routes
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/dashboard" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
