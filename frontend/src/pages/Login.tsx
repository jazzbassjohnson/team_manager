import LoginForm from '@/components/LoginForm.tsx';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext.tsx';
import { Navigate } from 'react-router-dom';

function Login() {
  const { isAuthenticated } = useContext(AuthContext);

  return !isAuthenticated ? (
    <>
      <h1>Login</h1>
      <LoginForm route={'/token/'} />;
    </>
  ) : (
    <Navigate to={'/'} />
  );
}

export default Login;
