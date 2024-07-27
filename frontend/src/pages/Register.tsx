import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'

const Register: React.FC = () => {
    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { register } = useContext(AuthContext)

    // Clear local storage on component mount
    useEffect(() => {
        localStorage.clear()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await register(username, firstName, lastName, email, password)
    }

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        name={'username'}
                        required
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        name={'firstName'}
                        required
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        name={'lastName'}
                        required
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        name={'email'}
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
                        name={'password'}
                        required
                    />
                </div>
                <Button type="submit">Register</Button>
            </form>
        </>
    )
}

export default Register
