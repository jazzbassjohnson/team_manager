import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/context/constants.ts';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import api from '@/api.ts';
import { Button } from '@/components/ui/button.tsx';

type FormProps = {
    route: string;
    method: string;
};

function Form({ route, method }: FormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [loading, setLoading] = useState(false);
    const title = method === 'POST' ? 'Register' : 'Login';

    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await api.post(route, {
                email,
                password,
            });

            if (method === 'login') {
                if (response.status === 200) {
                    localStorage.setItem(ACCESS_TOKEN, response.data.access);
                    localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                    navigate('/');
                } else {
                    navigate('/login');
                }
            }
        } catch (error) {
            console.log('error', error);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={'form-container'}>
            <h1>{title}</h1>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Username</Label>
                <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
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
            <Button type="submit" disabled={loading}>
                Submit
            </Button>
        </form>
    );
}

export default Form;
