import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const authContext = useContext(AuthContext)

    if (!authContext) {
        return <div></div>
    }
    const { login } = authContext

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await login(username, password)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="username">Username</Label>

                <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
            </div>
            <button type="submit">Login</button>
        </form>
    )
}

export default Login
