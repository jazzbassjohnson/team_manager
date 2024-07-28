import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/context/constants.ts';
import api from '@/api.ts';
import { Button } from '@/components/ui/button.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type FormProps = {
  route: string;
};

// Define the schema for the login form
const loginFormSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

function LoginForm({ route }: FormProps) {
  // Set up the form state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Create a form with validation
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    try {
      const { username, password } = values;
      const response = await api.post(route, {
        username: username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={'form-container'}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder={'Username'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={'password'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder={'Password'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
