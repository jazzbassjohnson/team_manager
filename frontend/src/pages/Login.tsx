import LoginForm from '@/components/LoginForm.tsx';

function Login() {
  return (
    <>
      <h1>Login</h1>
      <LoginForm route={'/token/'} />;
    </>
  );
}

export default Login;
